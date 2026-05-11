import { Pool } from "mysql2/promise";
import { User, PasswordReset, UserSession } from "./auth.model";
import { pool } from "../../config/db"; 
import { generateUUID } from "../../utils/uuui";
import { uploadToCloudinary } from "../../utils/fileHandling";
import { getPublicIdFromUrl } from "../../utils/fileHandling";
import { deleteFromCloudinary } from "../../utils/fileHandling";

export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}


export async function getUserById(id: number): Promise<User | null> {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}


export async function createUser(data: {
  name: string;
  email: string;
  password_hash: string;
  role?: string;
}): Promise<string> {
  const id = generateUUID();
  await pool.query(
    "INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())",
    [id, data.name, data.email, data.password_hash, data.role || "user"] // <- 5 values match placeholders
  );
  return id;
}


export async function updateUserPassword(userId: number, password_hash: string): Promise<void> {
  await pool.query(
    "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
    [password_hash, userId]
  );
}


export async function createPasswordReset(data: {
  user_id: number;
  reset_token: string;
  expires_at: Date;
  used: boolean;
}): Promise<number> {
  const id = generateUUID();

  const [result]: any = await pool.query(
    "INSERT INTO password_resets (id,user_id, reset_token, expires_at, used, created_at) VALUES (?,?, ?, ?, ?, NOW())",
    [id,data.user_id, data.reset_token, data.expires_at, data.used ? 1 : 0]
  );
  return result.insertId;
}


export async function getPasswordResetByToken(token: string): Promise<PasswordReset | null> {
  const [rows]: any = await pool.query(
    "SELECT * FROM password_resets WHERE reset_token = ?",
    [token]
  );
  if (!rows[0]) return null;
  return {
    ...rows[0],
    used: !!rows[0].used,
  };
}


export async function markPasswordResetUsed(id: number): Promise<void> {
  await pool.query(
    "UPDATE password_resets SET used = 1 WHERE id = ?",
    [id]
  );
}


export async function createUserSession(data: {
  user_id: number;
  device_info: string;
  ip_address: string;
  refresh_token: string;
  logged_in_at: Date;
  expires_at: Date;
  is_active: boolean;
}): Promise<number> {
  const id = generateUUID();
  const [result]: any = await pool.query(
    `INSERT INTO user_sessions 
    (id,user_id, device_info, ip_address, refresh_token, logged_in_at, expires_at, is_active)
    VALUES (?,?, ?, ?, ?, ?, ?, ?)`,
    [id,data.user_id, data.device_info, data.ip_address, data.refresh_token, data.logged_in_at, data.expires_at, data.is_active ? 1 : 0]
  );
  return result.insertId;
}


export async function getSessionByRefreshToken(token: string): Promise<UserSession | null> {
  const [rows]: any = await pool.query(
    "SELECT * FROM user_sessions WHERE refresh_token = ?",
    [token]
  );
  if (!rows[0]) return null;
  return {
    ...rows[0],
    is_active: !!rows[0].is_active,
  };
}



export async function getAllUsers(): Promise<User[]> {
  const [rows]: any = await pool.query("SELECT id, name, email, role, profile_image, is_active, created_at, updated_at FROM users");
  return rows;
}


export async function getUserByIdFull(id: number): Promise<User | null> {
  const [rows]: any = await pool.query(
    "SELECT id, name, email, role, profile_image, is_active, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}


export async function getCurrentUser(id: number): Promise<User | null> {
  return getUserByIdFull(id);
}

export async function logoutUserSession(userId: string, refreshToken: string): Promise<void> {
  await pool.query(
    "UPDATE user_sessions SET is_active = 0 WHERE user_id = ? AND refresh_token = ?",
    [userId, refreshToken]
  );
}

export async function getUserSessions(userId: string): Promise<UserSession[]> {
  const [rows]: any = await pool.query(
    "SELECT * FROM user_sessions WHERE user_id = ? AND is_active = 1",
    [userId]
  );

  return rows.map((row: any) => ({
    ...row,
    is_active: !!row.is_active,
  }));
}

export async function deleteUserById(userId: number): Promise<void> {
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
}


export async function updateUserProfile(
  userId: string,
  data: { name?: string }
) {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.name) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (fields.length === 0) {
    throw new Error("No data to update");
  }

  values.push(userId);

  await pool.query(
    `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
    values
  );

  const [rows]: any = await pool.query(
    "SELECT id, name, email, profile_image FROM users WHERE id = ?",
    [userId]
  );

  return rows[0];
}




export { pool };