import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if username already exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("Username is already taken");
  }

  // Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email is already registered");
  }

  // Create User
  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        savedPins: user.savedPins,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find User by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        savedPins: user.savedPins,
      },
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Get current user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
