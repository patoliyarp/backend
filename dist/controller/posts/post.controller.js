"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeavyPost = exports.deletePost = exports.updatePost = exports.addPost = exports.getAllPost = exports.getPost = void 0;
const ApiError_1 = require("../../utils/ApiError");
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
/**
 * @async
 * @function getPost
 * @description Returns a hardcoded sample post.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
const getPost = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "post get successfully ",
            post: {
                id: 1,
                name: "this is the end",
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getPost = getPost;
/**
 * @async
 * @function getAllPost
 * @description Find all post from json server and return.
 *
 * @param {Request} req - Express request object .
 * @param {Response} res - Express response object return all post.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @returns {post} return  post with success status
 */
const getAllPost = async (req, res, next) => {
    try {
        const { data } = await axios_1.default.get(`${process.env.JSON_SERVE}/post`);
        const posts = data;
        if (!posts) {
            return next(new ApiError_1.ApiError("error while get posts", 500));
        }
        res
            .status(200)
            .json({ success: true, message: "post get successfully", posts });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllPost = getAllPost;
/**
 * @async
 * @function addPost
 * @description Adds a new post after ensuring no duplicate ID exists.
 *
 * @param {Request} req - Express request object containing new post in body.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @return {post} return new post with success status
 */
const addPost = async (req, res, next) => {
    try {
        const newPost = req.body;
        //Get post to find existing post
        const { data } = await axios_1.default.get(`${process.env.JSON_SERVE}/post`);
        //find existing post by id
        const findPost = data.some((p) => p.id == newPost.id);
        if (findPost) {
            return next(new ApiError_1.ApiError("Post already exist", 409));
        }
        const uploadPost = await axios_1.default.post(`${process.env.JSON_SERVE}/post`, newPost);
        console.log("data after uploaded", uploadPost);
        res.status(201).json({
            success: true,
            message: "Post add successfully",
            post: newPost,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addPost = addPost;
/**
 * @async
 * @function updatePost
 * @description Updates an existing post by ID.
 *
 * @param {Request} req - Express request object containing params and updated data.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @returns {post} return updated post
 */
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const Post = req.body;
        if (!id) {
            return next(new ApiError_1.ApiError("Id is required to update Post", 400));
        }
        //Get post to find existing post
        const { data } = await axios_1.default.get(`${process.env.JSON_SERVE}/post`);
        //find existing post by id
        const findPost = data.some((p) => p.id == Number(id));
        if (!findPost) {
            return next(new ApiError_1.ApiError("Post is not exist", 500));
        }
        console.log("find", findPost);
        const updatedPost = await axios_1.default.patch(`${process.env.JSON_SERVE}/post/${id}`, Post);
        console.log("updatedPost", updatedPost);
        res.status(201).json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost.data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
/**
 * @async
 * @function deletePost
 * @description Deletes an existing post by ID.
 *
 * @param {Request} req - Express request object containing the ID to delete.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @returns {post} return success status for deleted post
 */
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new ApiError_1.ApiError("Id is required to delete Post", 400));
        }
        //Get post to find existing post
        const { data } = await axios_1.default.get(`${process.env.JSON_SERVE}/post`);
        //find existing post by id
        const findPost = data.some((p) => p.id == Number(id));
        if (!findPost) {
            return next(new ApiError_1.ApiError("Post is not exist", 500));
        }
        const deletedPost = await axios_1.default.delete(`${process.env.JSON_SERVE}/post/${id}`);
        res.status(201).json({
            success: true,
            message: "Post delete successfully",
            post: deletedPost.data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
/**
 * @async
 * @function getHeavyPost
 * @description Perform complex calculation using worker thread
 *
 * @param {Request} req - Express request object contains value to perform complex calculation on it
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @returns return heavy complex calculated answer
 */
const getHeavyPost = async (req, res, next) => {
    try {
        const { value } = req.body;
        //Handle worker path for typescript esm
        const workerPath = path_1.default.resolve(__dirname, "../../utils/Worker.js");
        //Initialize worker thread instance
        const worker = new worker_threads_1.Worker(workerPath, {
            execArgv: ["--import", "ts-node/esm"],
            workerData: { num: value },
        });
        //listen worker response and send
        worker.on("message", (data) => {
            res.status(200).json({
                success: true,
                message: "Get heavy post successfully",
                data,
            });
        });
        //listen worker error
        worker.on("error", (err) => {
            next(new ApiError_1.ApiError(`Error while get Heavy post ${err}`, 500));
        });
    }
    catch (error) {
        next(new ApiError_1.ApiError(`Error while get Heavy post ${error}`, 500));
    }
};
exports.getHeavyPost = getHeavyPost;
//# sourceMappingURL=post.controller.js.map