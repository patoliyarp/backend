import { NextFunction, Response, Request } from "express";
import { Post } from "../../models/post.models";
import { ApiError } from "../../utils/ApiError";
import type { Posts } from "../../schema/postsSchema";
import { cacheClient } from "../../pubsub/redisClient";

//create an key based on params
function constructKey(req: Request) {
  // api:posts
  const baseUrl = req.path.replace(/^\+|\/+$/g, "").replace(/\//g, ":");
  // Merge route params and query params to accurately
  const params = { ...req.params, ...req.query } as Record<string, unknown>;

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
}

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
  req: Request<{}, {}, Posts>,
  res: Response,
  next: NextFunction,
) {
  //Get query params
  const query = req.query.q;
  const sortQuery = req.query.sort;
  const sortByDate = sortQuery === "desc" ? -1 : sortQuery === "asc" ? 1 : "";
  const tags = (req.query.tags as string[]) || [];
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const skip = (page - 1) * limit;

  type Filter = {
    title?: Record<string, unknown>;
    tags?: Record<string, unknown>;
  };

  const filter: Filter = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (tags.length > 0) {
    filter.tags = { $in: tags };
  }

  try {
    // :limit=6&page=2&q=wake&sort=desc&tags=anime
    const KEY = constructKey(req);

    const cachedPosts = await cacheClient.get(KEY);

    //return response if cache is exists
    if (cachedPosts) {
      return res.status(200).json({
        success: true,
        message: "come from redis cache",
        posts: JSON.parse(cachedPosts),
      });
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: sortByDate || -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!posts) {
      return next(new ApiError("Post not exists in database", 400));
    }

    //Implement redis caching if not exist
    await cacheClient.set(KEY, JSON.stringify(posts), {
      expiration: { type: "EX", value: 60 * 30 },
    });

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
    const userId = req?.user?.id;
    posts.userId = userId;

    //Create new post in database
    const newPost = await Post.create(posts);

    if (!newPost) {
      return next(new ApiError("Error while create post", 500));
    }

    //After adding new post remove all cached data
    cacheClient.flushAll();

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

    const post = await Post.findById(id);

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    //Check if post is user post or not
    if (!post?.userId?.equals(req?.user?.id)) {
      return next(
        new ApiError("User don't have access to update this post", 403),
      );
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

    const post = await Post.findById(id);

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    //Check if post is user post or not
    if (!post?.userId.equals(req?.user?.id)) {
      return next(
        new ApiError("User don't have access to delete this post", 403),
      );
    }

    const deletedPosts = await Post.deleteOne({ _id: id });

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

/**
 * Get a post by User .
 *
 * @async
 * @function deletePosts
 * @param {Request<{ id: string }, {}, Posts>} req - Express request object with 'id' as URL param.
 * @param {Response} res - Express response object used to send back confirmation of deletion.
 * @param {NextFunction} next - Callback to pass control to the next middleware or error handler.
 * @returns {Promise<void>} Responds with JSON containing success status, message, and the deleted post or passes an error.
 */
async function getPostById(req: Request, res: Response, next: NextFunction) {
  try {
    const userid = req.user?.id;

    const posts = await Post.find({ userId: userid });

    if (!posts) {
      return next(new ApiError("Can not find post", 404));
    }

    return res.status(200).json({
      success: true,
      message: "post get successfully",
      post: posts,
    });
  } catch (error) {
    next(error);
  }
}

export { getPosts, addPosts, updatePosts, deletePosts, getPostById };
