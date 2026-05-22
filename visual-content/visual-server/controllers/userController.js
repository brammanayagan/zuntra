import User from "../models/User.js";
import Pin from "../models/Pin.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadImage } from "../services/cloudinaryService.js";

// @desc    Get user profile with populated created and saved pins
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "username avatar")
    .populate("following", "username avatar");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Fetch pins created by this user
  const createdPins = await Pin.find({ postedBy: user._id })
    .populate("postedBy", "username avatar")
    .sort({ createdAt: -1 });

  // Fetch saved pins details
  const savedPins = await Pin.find({ _id: { $in: user.savedPins } })
    .populate("postedBy", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    profile: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      followers: user.followers,
      following: user.following,
      createdPins,
      savedPins,
    },
  });
});

// @desc    Update user profile details
// @route   PUT /api/users/update
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { username, bio } = req.body;

  if (username && username !== user.username) {
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      res.status(400);
      throw new Error("Username is already taken");
    }
    user.username = username;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  // Handle avatar upload if present
  if (req.file) {
    const avatarUrl = await uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    user.avatar = avatarUrl;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      followers: updatedUser.followers,
      following: updatedUser.following,
      savedPins: updatedUser.savedPins,
    },
  });
});

// @desc    Get logged in user's saved pins
// @route   GET /api/users/saved
// @access  Private
export const getSavedPins = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const savedPins = await Pin.find({ _id: { $in: user.savedPins } })
    .populate("postedBy", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: savedPins.length,
    savedPins,
  });
});

// @desc    Follow/Unfollow user profile (Social feature)
// @route   PUT /api/users/follow/:id
// @access  Private
export const followToggle = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user._id;

  if (targetId.toString() === currentUserId.toString()) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }

  const targetUser = await User.findById(targetId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    res.status(404);
    throw new Error("User profile not found");
  }

  const isFollowing = currentUser.following.includes(targetId);

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetId.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );
  } else {
    // Follow
    currentUser.following.push(targetId);
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  res.status(200).json({
    success: true,
    isFollowing: !isFollowing,
    followersCount: targetUser.followers.length,
  });
});
