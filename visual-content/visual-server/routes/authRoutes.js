import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/authController.js";
import {
  registerValidationRules,
  loginValidationRules,
  validate,
} from "../validations/authValidation.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidationRules, validate, registerUser);
router.post("/login", loginValidationRules, validate, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

export default router;
