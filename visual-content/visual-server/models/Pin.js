import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Pin title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Pin image is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [800, "Description cannot exceed 800 characters"],
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator reference is required"],
    },
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing for search performance
pinSchema.index({ title: "text", description: "text", category: "text" });

const Pin = mongoose.model("Pin", pinSchema);

export default Pin;
