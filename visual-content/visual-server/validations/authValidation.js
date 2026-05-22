import { body, validationResult } from "express-validator";

export const registerValidationRules = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Username can only contain alphanumeric characters and underscores"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidationRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => err.msg).join(", ");
  res.status(400);
  return next(new Error(extractedErrors));
};
