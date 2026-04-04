import { NextFunction, Response, Request } from "express";
import { Post } from "../../models/post.models";
import { ApiError } from "../../utils/ApiError";
import type { Posts } from "../../schema/postsSchema";
import logger from "../../config/logger.config";

/**
 * Retrieves all posts from the database.
 *
 * @async
 * @function getPosts
 * @param {Request<{}, {}, Posts>} req - Express request object (no params or query, body typed as Posts).
 * @param {Response} res - Express response object used to send back the list of posts.
 * @param {NextFunction} next - Callback to pass control to the next middleware or error handler.
 * @returns {Promise<void>} Responds with JSON containing success status and an array of posts or passes an error.
 */
async function getPosts(
  req: Request<{ page: number }, {}, Posts>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { page } = req.params;
    const limit = 5;
    const skip = (page - 1) * limit;
    console.log("start fetch");
    logger.info("start fetch");
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ title: 1 })
      .lean();
    logger.info("end fetch");

    console.log("end fetch");
    if (!posts) {
      return next(new ApiError("Post not exists in database", 400));
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a new post in the database.
 *
 * @async
 * @function addPosts
 * @param {Request<{}, {}, Posts>} req - Express request object with new post data in the body.
 * @param {Response} res - Express response object used to send back the created post.
 * @param {NextFunction} next - Callback to pass control to the next middleware or error handler.
 * @returns {Promise<void>} Responds with JSON containing success status, message, and the created post or passes an error.
 */
async function addPosts(
  req: Request<{}, {}, Posts>,
  res: Response,
  next: NextFunction,
) {
  try {
    const posts = req.body;

    //Create new post in database
    const newPost = await Post.create(posts);

    if (!newPost) {
      return next(new ApiError("Error while create post", 500));
    }

    res.status(200).json({
      success: true,
      message: "Post add successfully",
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an existing post by ID.
 *
 * @async
 * @function updatePosts
 * @param {Request<{ id: string }, {}, Partial<Posts>>} req - Express request object with 'id' as URL param and update data in the body.
 * @param {Response} res - Express response object used to send back the updated post.
 * @param {NextFunction} next - Callback to pass control to the next middleware or error handler.
 * @returns {Promise<void>} Responds with JSON containing success status, message, and the updated post or passes an error.
 */
async function updatePosts(
  req: Request<{ id: string }, {}, Partial<Posts>>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return next(new ApiError("Id is required to delete post", 400));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedPost) {
      return next(new ApiError("Post not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Post update successfully",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a post by ID.
 *
 * @async
 * @function deletePosts
 * @param {Request<{ id: string }, {}, Posts>} req - Express request object with 'id' as URL param.
 * @param {Response} res - Express response object used to send back confirmation of deletion.
 * @param {NextFunction} next - Callback to pass control to the next middleware or error handler.
 * @returns {Promise<void>} Responds with JSON containing success status, message, and the deleted post or passes an error.
 */
async function deletePosts(
  req: Request<{ id: string }, {}, Posts>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError("Id is required to delete Post", 400));
    }

    const deletedPosts = await Post.findByIdAndDelete(id);

    if (!deletedPosts) {
      return next(new ApiError("Post not found ", 404));
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      post: deletePosts,
    });
  } catch (error) {
    next(error);
  }
}

export { getPosts, addPosts, updatePosts, deletePosts };
