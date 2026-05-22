import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getSavedPins,
  followToggle,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Saved pins route placed before ID wildcard
router.get("/saved", protect, getSavedPins);
router.get("/:id", getUserProfile);

// Profile actions
router.put("/update", protect, upload.single("avatar"), updateUserProfile);
router.put("/follow/:id", protect, followToggle);

export default router;
