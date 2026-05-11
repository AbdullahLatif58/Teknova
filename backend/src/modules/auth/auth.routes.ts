import { Router } from "express";
import {
  signup,
  login,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  listUsers,
  getUser,
  logout,
  getProfile,
  deleteUser,
  updateMe,
} from "./auth.controller";
import { body } from "express-validator";
import { validate } from "../../utils/validation";
import { authenticateToken } from "./auth.middleware";
import { authorizeAdmin } from "./admin.middleware";

const router = Router();

router.get("/users", authenticateToken, authorizeAdmin, listUsers);
router.get("/users/:id", authenticateToken, authorizeAdmin, getUser);
router.get("/me", authenticateToken, getProfile);


router.post(
  "/signup",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ]),
  signup
);

router.post(
  "/login",
  validate([
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);


router.post("/password-forget", requestPasswordReset);


router.post("/password-reset/:token", resetPassword);


router.post("/refresh-token", refreshToken);

router.post("/logout", authenticateToken, logout);

router.delete("/users/:id", authenticateToken, authorizeAdmin, deleteUser);

router.patch("/me", authenticateToken, updateMe);
router.patch("/users/:id", authenticateToken, authorizeAdmin, updateMe); // Reusing updateMe logic but with ID param if provided



export default router;