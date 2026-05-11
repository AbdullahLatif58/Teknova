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

const router = Router();

router.get("/users", listUsers);        
router.get("/users/:id", getUser);    
router.get("/me",getProfile);           


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

router.post("/logout", logout);

router.delete("/users/:id", deleteUser);

router.patch("/me", updateMe);



export default router;