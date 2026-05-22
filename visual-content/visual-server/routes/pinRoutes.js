import express from "express";
import {
  createPin,
  getPins,
  getPinById,
  deletePin,
  saveToggle,
  likeToggle,
  addComment,
  deleteComment,
} from "../controllers/pinController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { pinValidationRules, validatePin } from "../validations/pinValidation.js";

const router = express.Router();

router.get("/", getPins);
router.get("/:id", getPinById);

// Protected routes
router.post("/", protect, upload.single("image"), pinValidationRules, validatePin, createPin);
router.delete("/:id", protect, deletePin);
router.put("/save/:id", protect, saveToggle);
router.put("/like/:id", protect, likeToggle);
router.post("/comment/:id", protect, addComment);
router.delete("/comment/:id/:commentId", protect, deleteComment);

export default router;
