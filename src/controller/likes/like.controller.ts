import { Request, Response, NextFunction } from "express";
import { LikeModel } from "../../models/like.models";
import { Post } from "../../models/post.models";
import { ApiError } from "../../utils/ApiError";

// async function reactToPost(req: Request, res: Response, next: NextFunction) {
//   try {
//     const userId = req?.user?.id;
//     const postId = req.body.id;

//     // "like" | "dislike"
//     const { type } = req.body;

//     if (!userId || !postId || !type) {
//       return next(new ApiError("userId, postId and type are required", 400));
//     }

//     const update =
//       type === "like"
//         ? { isLiked: true, isDislike: false }
//         : { isLiked: false, isDislike: true };

//     await LikeModel.findOneAndUpdate(
//       { userId, postId },
//       { $set: update },
//       { upsert: true, new: true },
//     );

//     res.status(200).json({
//       msg: `${type} successful`,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

async function reactToPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const postId = req.body.postId;
    const { type } = req.body; // "like" | "dislike"
    console.log("all", userId, postId, type);
    if (!userId || !postId || !type) {
      return next(new ApiError("userId, postId and type are required", 400));
    }

    const existing = await LikeModel.findOne({ userId, postId });

    let updateReaction = {};
    let inc = {};

    if (!existing) {
      if (type === "like") {
        updateReaction = { isLiked: true, isDislike: false };
        inc = { "reactions.likes": 1 };
      } else {
        updateReaction = { isLiked: false, isDislike: true };
        inc = { "reactions.dislikes": 1 };
      }

      await LikeModel.create({ userId, postId, ...updateReaction });
    } else {
      // Toggle LIKE
      if (existing.isLiked && type === "like") {
        updateReaction = { isLiked: false };
        inc = { "reactions.likes": -1 };
      }

      // Toggle DISLIKE
      else if (existing.isDislike && type === "dislike") {
        updateReaction = { isDislike: false };
        inc = { "reactions.dislikes": -1 };
      }

      // LIKE → DISLIKE
      else if (existing.isLiked && type === "dislike") {
        updateReaction = { isLiked: false, isDislike: true };
        inc = { "reactions.likes": -1, "reactions.dislikes": 1 };
      }

      // DISLIKE → LIKE
      else if (existing.isDislike && type === "like") {
        updateReaction = { isLiked: true, isDislike: false };
        inc = { "reactions.likes": 1, "reactions.dislikes": -1 };
      }

      await LikeModel.updateOne(
        { _id: existing._id },
        { $set: updateReaction },
      );
    }

    if (Object.keys(inc).length > 0) {
      await Post.findByIdAndUpdate(postId, {
        $inc: inc,
      });
    }

    res.status(200).json({
      msg: "Reaction updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function reactToPost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const postId = req.body.postId;
    const { type } = req.body; // "like" | "dislike"

    if (!userId || !postId || !type) {
      return next(new ApiError("userId, postId and type are required", 400));
    }

    const existing = await LikeModel.findOne({ userId, postId });

    let inc = {};
    let updateReaction = {};

    if (!existing) {
      if (type === "like") {
        await LikeModel.create({
          userId,
          postId,
          isLiked: true,
          isDislike: false,
        });

        inc = { "reactions.likes": 1 };
      } else {
        await LikeModel.create({
          userId,
          postId,
          isLiked: false,
          isDislike: true,
        });

        inc = { "reactions.dislikes": 1 };
      }
    }

    else {
      if (existing.isLiked && type === "like") {
        return res.status(200).json({
          msg: "Already liked",
        });
      }

      if (existing.isDislike && type === "dislike") {
        return res.status(200).json({
          msg: "Already disliked",
        });
      }

      if (existing.isLiked && type === "dislike") {
        updateReaction = { isLiked: false, isDislike: true };
        inc = { "reactions.likes": -1, "reactions.dislikes": 1 };
      }

      if (existing.isDislike && type === "like") {
        updateReaction = { isLiked: true, isDislike: false };
        inc = { "reactions.likes": 1, "reactions.dislikes": -1 };
      }

      await LikeModel.updateOne(
        { _id: existing._id },
        { $set: updateReaction },
      );
    }

    if (Object.keys(inc).length > 0) {
      await Post.findByIdAndUpdate(postId, {
        $inc: inc,
      });
    }

    res.status(200).json({
      msg: `${type} recorded successfully`,
    });
  } catch (error) {
    next(error);
  }
}
export { reactToPost, reactToPosts };
