"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactToPost = reactToPost;
exports.reactToPosts = reactToPosts;
const like_models_1 = require("../../models/like.models");
const post_models_1 = require("../../models/post.models");
const ApiError_1 = require("../../utils/ApiError");
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
async function reactToPosts(req, res, next) {
    try {
        const userId = req.user?.id;
        const postId = req.body.postId;
        const { type } = req.body; // "like" | "dislike"
        console.log("all", userId, postId, type);
        if (!userId || !postId || !type) {
            return next(new ApiError_1.ApiError("userId, postId and type are required", 400));
        }
        const existing = await like_models_1.LikeModel.findOne({ userId, postId });
        let updateReaction = {};
        let inc = {};
        if (!existing) {
            if (type === "like") {
                updateReaction = { isLiked: true, isDislike: false };
                inc = { "reactions.likes": 1 };
            }
            else {
                updateReaction = { isLiked: false, isDislike: true };
                inc = { "reactions.dislikes": 1 };
            }
            await like_models_1.LikeModel.create({ userId, postId, ...updateReaction });
        }
        else {
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
            await like_models_1.LikeModel.updateOne({ _id: existing._id }, { $set: updateReaction });
        }
        if (Object.keys(inc).length > 0) {
            await post_models_1.Post.findByIdAndUpdate(postId, {
                $inc: inc,
            });
        }
        res.status(200).json({
            msg: "Reaction updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
}
async function reactToPost(req, res, next) {
    try {
        const userId = req.user?.id;
        const postId = req.body.postId;
        const { type } = req.body; // "like" | "dislike"
        if (!userId || !postId || !type) {
            return next(new ApiError_1.ApiError("userId, postId and type are required", 400));
        }
        const existing = await like_models_1.LikeModel.findOne({ userId, postId });
        let inc = {};
        let updateReaction = {};
        if (!existing) {
            if (type === "like") {
                await like_models_1.LikeModel.create({
                    userId,
                    postId,
                    isLiked: true,
                    isDislike: false,
                });
                inc = { "reactions.likes": 1 };
            }
            else {
                await like_models_1.LikeModel.create({
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
            await like_models_1.LikeModel.updateOne({ _id: existing._id }, { $set: updateReaction });
        }
        if (Object.keys(inc).length > 0) {
            await post_models_1.Post.findByIdAndUpdate(postId, {
                $inc: inc,
            });
        }
        res.status(200).json({
            msg: `${type} recorded successfully`,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=like.controller.js.map