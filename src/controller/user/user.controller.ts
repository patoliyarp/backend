import type { NextFunction, Request, Response } from "express";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "welcome to our website user",
      user: {
        id: 1,
        name: "this",
        email: "lala@compnay.com",
      },
    });
  } catch (err) {
    next(err);
  }
};

export { getUser };
