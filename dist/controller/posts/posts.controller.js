"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.addPosts = addPosts;
exports.updatePosts = updatePosts;
exports.deletePosts = deletePosts;
exports.getPostById = getPostById;
const post_models_1 = require("../../models/post.models");
const ApiError_1 = require("../../utils/ApiError");
const redisClient_1 = require("../../pubsub/redisClient");
//create an key based on params
function constructKey(req) {
    // api:posts
    const baseUrl = req.path.replace(/^\+|\/+$/g, "").replace(/\//g, ":");
    // Merge route params and query params to accurately
    const params = { ...req.params, ...req.query };
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
async function getPosts(req, res, next) {
    //Get query params
    const query = req.query.q;
    const sortQuery = req.query.sort;
    const sortByDate = sortQuery === "desc" ? -1 : sortQuery === "asc" ? 1 : "";
    const tags = req.query.tags || [];
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }
    if (tags.length > 0) {
        filter.tags = { $in: tags };
    }
    try {
        // :limit=6&page=2&q=wake&sort=desc&tags=anime
        const KEY = constructKey(req);
        const cachedPosts = await redisClient_1.cacheClient.get(KEY);
        //return response if cache is exists
        if (cachedPosts) {
            return res.status(200).json({
                success: true,
                message: "come from redis cache",
                posts: JSON.parse(cachedPosts),
            });
        }
        const posts = await post_models_1.Post.find(filter)
            .sort({ createdAt: sortByDate || -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        if (!posts) {
            return next(new ApiError_1.ApiError("Post not exists in database", 400));
        }
        //Implement redis caching if not exist
        await redisClient_1.cacheClient.set(KEY, JSON.stringify(posts), {
            expiration: { type: "EX", value: 60 * 30 },
        });
        res.status(200).json({ success: true, posts });
    }
    catch (error) {
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
async function addPosts(req, res, next) {
    try {
        const posts = req.body;
        const userId = req?.user?.id;
        posts.userId = userId;
        //Create new post in database
        const newPost = await post_models_1.Post.create(posts);
        if (!newPost) {
            return next(new ApiError_1.ApiError("Error while create post", 500));
        }
        //After adding new post remove all cached data
        redisClient_1.cacheClient.flushAll();
        res.status(200).json({
            success: true,
            message: "Post add successfully",
            post: newPost,
        });
    }
    catch (error) {
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
async function updatePosts(req, res, next) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!id) {
            return next(new ApiError_1.ApiError("Id is required to delete post", 400));
        }
        const post = await post_models_1.Post.findById(id);
        if (!post) {
            return next(new ApiError_1.ApiError("Post not found", 404));
        }
        //Check if post is user post or not
        if (!post?.userId?.equals(req?.user?.id)) {
            return next(new ApiError_1.ApiError("User don't have access to update this post", 403));
        }
        const updatedPost = await post_models_1.Post.findByIdAndUpdate(id, updateData, {
            returnDocument: "after",
            runValidators: true,
        });
        if (!updatedPost) {
            return next(new ApiError_1.ApiError("Post not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Post update successfully",
            post: updatedPost,
        });
    }
    catch (error) {
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
async function deletePosts(req, res, next) {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError_1.ApiError("Id is required to delete Post", 400));
        }
        const post = await post_models_1.Post.findById(id);
        if (!post) {
            return next(new ApiError_1.ApiError("Post not found", 404));
        }
        //Check if post is user post or not
        if (!post?.userId.equals(req?.user?.id)) {
            return next(new ApiError_1.ApiError("User don't have access to delete this post", 403));
        }
        const deletedPosts = await post_models_1.Post.deleteOne({ _id: id });
        if (!deletedPosts) {
            return next(new ApiError_1.ApiError("Post not found ", 404));
        }
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            post: deletePosts,
        });
    }
    catch (error) {
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
async function getPostById(req, res, next) {
    try {
        const userid = req.user?.id;
        const posts = await post_models_1.Post.find({ userId: userid });
        if (!posts) {
            return next(new ApiError_1.ApiError("Can not find post", 404));
        }
        return res.status(200).json({
            success: true,
            message: "post get successfully",
            post: posts,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=posts.controller.js.map