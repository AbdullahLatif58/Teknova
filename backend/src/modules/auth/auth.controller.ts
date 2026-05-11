import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authservice from "./auth.services"

import { addEmailToQueue } from "../../notifications/queues/emailQueue";
import { asyncHandler, AppError } from "../../utils/errors";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existingUser = await authservice.getUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already exists", 409, "USER_ALREADY_EXISTS");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const userId = await authservice.createUser({ name, email, password_hash, role });
  await addEmailToQueue({
    to: email,
    subject: "Welcome to Teknova!",
    template: "signup",
    context: { name },
  });
  return res.status(201).json({ success: true, message: "User created", userId });
});


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, device_info, ip_address } = req.body;

  const user = await authservice.getUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401, "AUTH_INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401, "AUTH_INVALID_CREDENTIALS");
  }


  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET! || "70743kndslkd",
    { expiresIn: "15m" }
  );


  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET! || "hjjpwjwojn",
    { expiresIn: "7d" }
  );


  await authservice.createUserSession({
    user_id: user.id,
    device_info: device_info || "unknown",
    ip_address: ip_address || "0.0.0.0",
    refresh_token: refreshToken,
    logged_in_at: new Date(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    is_active: true,
  });


  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });


  return res.status(200).json({ success: true, message: "Login successful", user: { id: user.id, email: user.email, role: user.role } });
});


export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 400, "MISSING_FIELD");

  const user = await authservice.getUserByEmail(email);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const token = Math.random().toString(36).substring(2, 15);
  const expires_at = new Date(Date.now() + 60 * 60 * 1000);

  await authservice.createPasswordReset({ user_id: user.id, reset_token: token, expires_at, used: false });


  await addEmailToQueue({
    to: user.email,
    subject: "Password Reset Request",
    template: "forgetPassword",
    context: {
      name: user.name,
      resetLink: `${process.env.FRONTEND_URL}/reset-password/${token}`,
    },
  });

  return res.status(200).json({ success: true, message: "Password reset email sent" });
});


export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const token = req.params.token;
  const { newPassword } = req.body;
  if (!token || !newPassword)
    throw new AppError("Token and new password are required", 400, "MISSING_FIELD");

  const resetRecord = await authservice.getPasswordResetByToken(token as string);
  if (!resetRecord) throw new AppError("Invalid token", 404, "TOKEN_INVALID");
  if (resetRecord.used) throw new AppError("Token already used", 400, "TOKEN_ALREADY_USED");
  if (resetRecord.expires_at < new Date()) throw new AppError("Token expired", 400, "TOKEN_EXPIRED");

  const password_hash = await bcrypt.hash(newPassword, 10);
  await authservice.updateUserPassword(resetRecord.user_id, password_hash);
  await authservice.markPasswordResetUsed(resetRecord.id);

  return res.status(200).json({ success: true, message: "Password updated successfully" });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) throw new AppError("Refresh token is required", 400, "MISSING_FIELD");

  const session = await authservice.getSessionByRefreshToken(token);
  if (!session || !session.is_active) throw new AppError("Invalid or expired session", 401, "AUTH_SESSION_INVALID");

  const newAccessToken = jwt.sign({ id: session.user_id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  return res.status(200).json({ success: true, accessToken: newAccessToken });
});


export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await authservice.getAllUsers();
  return res.status(200).json({ success: true, users });
});


export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const user = await authservice.getUserByIdFull(id);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  return res.status(200).json({ success: true, user });
});


export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await authservice.getCurrentUser(userId);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  return res.status(200).json({ success: true, user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) throw new AppError("Not authenticated", 401, "AUTH_REQUIRED");

  const refreshToken = req.body.refreshToken || "";
  await authservice.logoutUserSession(user.id, refreshToken);


  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
});


export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id as string);
  if (!userId) throw new AppError("User ID is required", 400, "MISSING_FIELD");

  await authservice.deleteUserById(userId);
  return res.status(200).json({ success: true, message: "User deleted successfully" });
});



export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body;
  const user = await authservice.updateUserProfile(userId, req.body);

  res.json({
    success: true,
    data: user,
  });
});