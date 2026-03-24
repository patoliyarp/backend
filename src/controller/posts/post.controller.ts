import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import axios from "axios";

/**
 * @async
 * @function getPost
 * @description Returns a hardcoded sample post.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "post get successfully ",
      post: {
        id: 1,
        name: "this is the end",
      },
    });
  } catch (err) {
    next(err);
  }
};

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
const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = await axios.get(`${process.env.JSON_SERVE}/post`);
    const posts = data;

    if (!posts) {
      return next(new ApiError("error while get posts", 500));
    }

    res
      .status(200)
      .json({ success: true, message: "post get successfully", posts });
  } catch (err) {
    next(err);
  }
};

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
const addPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPost = req.body;
    console.log("newdata", newPost);

    //Get post to find existing post
    const { data } = await axios.get(`${process.env.JSON_SERVE}/post`);

    //find existing post by id
    const findPost = data.some((p: any) => p.id == newPost.id);
    if (findPost) {
      return next(new ApiError("Post already exist", 409));
    }

    const uploadPost = await axios.post(
      `${process.env.JSON_SERVE}/post`,
      newPost,
    );
    console.log("data after uploaded", uploadPost);
    res.status(201).json({
      success: true,
      message: "Post add successfully",
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

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
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const Post = req.body;
    if (!id) {
      return next(new ApiError("Id is required to update Post", 400));
    }

    //Get post to find existing post
    const { data } = await axios.get(`${process.env.JSON_SERVE}/post`);

    //find existing post by id
    const findPost = data.some((p: any) => p.id == id);
    if (!findPost) {
      return next(new ApiError("Post is not exist", 500));
    }
    console.log("find", findPost);
    const updatedPost = await axios.patch(
      `${process.env.JSON_SERVE}/post/${id}`,
      Post,
    );
    console.log("updatedPost", updatedPost);
    res.status(201).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost.data,
    });
  } catch (error) {
    next(new ApiError("error while delete post", 500));
  }
};

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
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError("Id is required to delete Post", 400));
    }

    //Get post to find existing post
    const { data } = await axios.get(`${process.env.JSON_SERVE}/post`);

    //find existing post by id
    const findPost = data.some((p: any) => p.id == id);
    if (!findPost) {
      return next(new ApiError("Post is not exist", 500));
    }

    const deletedPost = await axios.delete(
      `${process.env.JSON_SERVE}/post/${id}`,
    );

    res.status(201).json({
      success: true,
      message: "Post delete successfully",
      post: deletedPost.data,
    });
  } catch (error) {
    next(error);
  }
};

export { getPost, getAllPost, addPost, updatePost, deletePost };
