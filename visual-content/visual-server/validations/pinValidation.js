import { body, validationResult } from "express-validator";

export const pinValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Pin title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 800 })
    .withMessage("Description cannot exceed 800 characters"),
];

export const validatePin = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => err.msg).join(", ");
  res.status(400);
  return next(new Error(extractedErrors));
};
