import type { NextFunction, Request, Response } from "express";

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

export { getPost };
