import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment author is required"],
    },
    pin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pin",
      required: [true, "Associated pin is required"],
    },
    text: {
      type: String,
      required: [true, "Comment text cannot be empty"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
