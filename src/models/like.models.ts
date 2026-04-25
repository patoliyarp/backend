import mongoose from "mongoose";

const like = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDislike: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const LikeModel = mongoose.model("LikeModel", like);
