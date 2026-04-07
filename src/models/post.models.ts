import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: [5, "title must be at least 5 character long"],
    },
    body: {
      type: String,
      required: true,
      min: [10, "content must be 10 character long"],
    },
    tags: [{ type: String }],
    reactions: {
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
    },
    views: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true },
);

export const Post = mongoose.model("Post", postSchema);
