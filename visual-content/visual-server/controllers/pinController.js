import Pin from "../models/Pin.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a new pin
// @route   POST /api/pins
// @access  Private
export const createPin = asyncHandler(async (req, res) => {
  const { title, description, category, tags } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image for the pin");
  }

  // Upload image to Cloudinary (attached as req.file.path)
  const imageUrl = req.file.path;

  // Parse tags (tags can be sent as JSON array or comma separated string)
  let parsedTags = [];
  if (tags) {
    if (typeof tags === "string") {
      parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => t.trim()).filter(Boolean);
    }
  }

  const pin = await Pin.create({
    title,
    description,
    category,
    tags: parsedTags,
    image: imageUrl,
    postedBy: req.user._id,
  });

  const populatedPin = await Pin.findById(pin._id).populate("postedBy", "username avatar");

  res.status(201).json({
    success: true,
    pin: populatedPin,
  });
});

// @desc    Get all pins (with filters & search)
// @route   GET /api/pins
// @access  Public
export const getPins = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const pins = await Pin.find(query)
    .populate("postedBy", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pins.length,
    pins,
  });
});

// @desc    Get single pin details
// @route   GET /api/pins/:id
// @access  Public
export const getPinById = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id)
    .populate("postedBy", "username avatar bio followers following")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username avatar",
      },
    });

  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  res.status(200).json({
    success: true,
    pin,
  });
});

// @desc    Delete a pin
// @route   DELETE /api/pins/:id
// @access  Private
export const deletePin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  // Check ownership
  if (pin.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized: You can only delete your own pins");
  }

  // Delete all associated comments
  await Comment.deleteMany({ pin: pin._id });

  // Remove pin from all users' savedPins list
  await User.updateMany({ savedPins: pin._id }, { $pull: { savedPins: pin._id } });

  // Delete Pin
  await Pin.findByIdAndDelete(pin._id);

  res.status(200).json({
    success: true,
    message: "Pin deleted successfully",
  });
});

// @desc    Save/Unsave a pin
// @route   PUT /api/pins/save/:id
// @access  Private
export const saveToggle = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  const userId = req.user._id;
  const user = await User.findById(userId);

  const isSaved = pin.saves.includes(userId);

  if (isSaved) {
    // Unsave
    pin.saves = pin.saves.filter((id) => id.toString() !== userId.toString());
    user.savedPins = user.savedPins.filter((id) => id.toString() !== pin._id.toString());
  } else {
    // Save
    pin.saves.push(userId);
    user.savedPins.push(pin._id);
  }

  await pin.save();
  await user.save();

  res.status(200).json({
    success: true,
    isSaved: !isSaved,
    savesCount: pin.saves.length,
  });
});

// @desc    Like/Unlike a pin (Premium Feature)
// @route   PUT /api/pins/like/:id
// @access  Private
export const likeToggle = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  const userId = req.user._id;
  const isLiked = pin.likes.includes(userId);

  if (isLiked) {
    // Unlike
    pin.likes = pin.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    // Like
    pin.likes.push(userId);
  }

  await pin.save();

  res.status(200).json({
    success: true,
    isLiked: !isLiked,
    likesCount: pin.likes.length,
  });
});

// @desc    Add a comment to a pin
// @route   POST /api/pins/comment/:id
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const pinId = req.params.id;

  if (!text || text.trim() === "") {
    res.status(400);
    throw new Error("Comment text cannot be empty");
  }

  const pin = await Pin.findById(pinId);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  // Create Comment
  const comment = await Comment.create({
    text,
    pin: pinId,
    user: req.user._id,
  });

  // Push comment to Pin comments array
  pin.comments.push(comment._id);
  await pin.save();

  // Populate user info for immediate response
  const populatedComment = await Comment.findById(comment._id).populate("user", "username avatar");

  res.status(201).json({
    success: true,
    comment: populatedComment,
  });
});

// @desc    Delete a comment from a pin
// @route   DELETE /api/pins/comment/:id/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const { id: pinId, commentId } = req.params;

  const pin = await Pin.findById(pinId);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  // Check ownership (only the person who commented or the pin author can delete)
  if (
    comment.user.toString() !== req.user._id.toString() &&
    pin.postedBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Unauthorized: You cannot delete this comment");
  }

  // Remove comment from Pin array
  pin.comments = pin.comments.filter((cId) => cId.toString() !== commentId);
  await pin.save();

  // Delete Comment from database
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
