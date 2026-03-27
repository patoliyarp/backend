import type { NextFunction, Request, Response } from "express";
import type { UserType } from "../../schema/userSchema";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../models/user.models";
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

/**
 * handle user signup.
 * Creates a new user if the username or email does not already exist.
 *
 * @param req - Express Request with no URL params, no query params, and a body of type UserType
 *   @param req.body.username - The desired username for the new user
 *   @param req.body.email - The email address for the new user
 *   @param req.body.password - The password for the new user
 * @param res - Express Response object to send JSON response
 * @param next - Express NextFunction for error handling
 * @returns Promise resolving with a JSON response containing signup success message and user data
 */
async function signup(
  req: Request<{}, {}, UserType>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password } = req.body;

    //Check if field is not empty
    if ([username, email, password].some((val) => !val?.trim())) {
      return next(new ApiError("All fields are required", 400));
    }

    //Handle existing user
    const existingUser = await User.findOne({
      $or: [{ username, email }],
    });

    if (existingUser) {
      return next(new ApiError("user already exists", 409));
    }

    //Create new user
    const newUser = await User.create({
      username,
      email,
      password,
    });

    const userObj = {
      username: newUser.username,
      email: newUser.email,
    };

    res.status(200).json({
      success: true,
      message: "User signup successfully ",
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * authenticate a user and issue an access token via cookie.
 *
 * @param req - Express Request object containing login credentials in the body
 *   @param req.body.UsernameOrEmail - The username or email used for login
 *   @param req.body.password - The password used for login
 * @param res - Express Response object to set authentication cookie and send JSON response
 * @param next - Express NextFunction for error handling
 * @returns Promise resolving with a JSON response indicating login success
 */
async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { UsernameOrEmail, password } = req.body;

    //Check if field is not empty
    if (!UsernameOrEmail || !password) {
      return next(new ApiError("please give  proper values", 400));
    }

    //Handle existing user
    const existingUser = await User.findOne({
      $or: [{ username: UsernameOrEmail }, { email: UsernameOrEmail }],
    });

    if (!existingUser) {
      return next(new ApiError("User does not exist please signup first", 400));
    }

    //Compare password using bcrypt
    const passwordCompare = await existingUser.comparePassword(password);

    if (!passwordCompare) {
      return next(new ApiError("Password is not correct", 400));
    }

    //Generate accessToken
    const accessToken = existingUser.generateRefreshToken();

    const CookeAge = 7 * 24 * 60 * 60 * 1000;

    //Send cookies to user browser
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: CookeAge,
      })
      .json({
        success: true,
        message: "User login successfully",
      });
  } catch (error) {
    next(error);
  }
}

/**
 *  clear authentication cookie and sign out the user.
 *
 * @param req - Express Request object
 * @param res - Express Response object to clear cookie and send JSON response
 * @param next - Express NextFunction for error handling
 * @returns Promise resolving with a JSON response indicating signout success
 */
async function signout(req: Request, res: Response, next: NextFunction) {
  try {
    //Clear cookies from user browser
    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "user signout successfully",
      });
  } catch (error) {
    next(error);
  }
}

export { getUser, signup, signin, signout };
