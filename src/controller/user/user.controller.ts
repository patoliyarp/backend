import type { NextFunction, Request, Response } from "express";
import type { UserType } from "../../schema/userSchema";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../models/user.models";
import { UploadToCloudinary } from "../../utils/Cloudinary";
import crypto from "crypto";
import emailQueue from "../../queue/emailQueue";
import smsQueue from "../../queue/smsQueue";
// import eventBus from "../../services/eventEmitter";
import { publisher } from "../../pubsub/redisClient";

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
 *   @param req.file.avatar - The avatar file for user profile
 *   @param req.body.mobile - The mobile number of user
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

    //Handle avatar upload
    const avatarImage = req.file?.buffer;

    let imageUrl;
    if (avatarImage) {
      imageUrl = await UploadToCloudinary(avatarImage);
    }

    //Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      avatar: imageUrl?.secure_url,
      image_public_id: imageUrl?.public_id,
    });

    if (!newUser) {
      return next(new ApiError("Error while register user", 400));
    }
    //Send email after creating new user
    //Generate token for verify user
    const verificationToken = newUser.getVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    //Verify token route url and mail message
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/v1/users/verifyemail/${verificationToken}`;
    const message: string = verificationUrl;

    //Send mail
    // const mail = await sendEmail({
    //   email: newUser.email,
    //   subject: "Email Verification",
    //   message,
    // });

    const options = {
      email: newUser.email,
      subject: "Email Verification",
      message,
    };

    //email Job add to queue
    await emailQueue.add(
      "sendEmail",
      { options },
      { attempts: 2, backoff: 5000 },
    );

    //Send sms to user
    const number = req.body?.mobile;
    if (number) {
      //add sms job to queue
      await smsQueue.add("sendSms", { number }, { attempts: 2 });
    }

    const userObj = {
      username: newUser.username,
      email: newUser.email,
    };

    res.status(200).json({
      success: true,
      message: "User signup successfully please check your email to verify ",
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * handle user Verify email.
 *
 * @param req - Express Request with  URL params,  query params
 *   @param req.params.token - Token to validate user
 * @param res - Express Response object to send JSON response
 * @param next - Express NextFunction for error handling
 * @returns Promise resolving with a JSON response containing email verified message
 */
async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req?.params?.token as string)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
    });

    if (!user) {
      return next(new ApiError("Invalid or expired token", 400));
    }

    if (user.isVerified) {
      return next(new ApiError("User is verified", 409));
    }

    if (
      user.verificationTokenExpire &&
      user.verificationTokenExpire.getTime() < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
        email: user.email,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const message = "welcome to our website";
    const options = {
      email: user.email,
      subject: "Welcome email",
      message,
    };

    //Send email using bull mq add job to queue
    // const job = await emailQueue.add(
    //   "welcomeMail",
    //   { options },
    //   { attempts: 2, backoff: 5000 },
    // );

    //Send an email using event emitter
    // eventBus.emit("userSignup", options);

    //Send mail using redis pub sub model
    await publisher.publish("userSignup", JSON.stringify(options));

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
}

/**
 * handle resend verification email
 *
 * @param req - Express Request with  body
 *   @param req.body.emil- Email to fetch user
 * @param res - Express Response object to send JSON response
 * @param next - Express NextFunction for error handling
 * @returns Promise resolving with a JSON response containing email verified message
 */
async function resendEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return next(new ApiError("User is not found", 404));
    }

    if (existingUser.isVerified) {
      return next(new ApiError("User is verified", 409));
    }

    const verificationToken = existingUser.getVerificationToken();
    await existingUser.save({ validateBeforeSave: false });

    const verificationUrl = `${req.protocol}://${req.get("host")}/api/user/verifyemail/${verificationToken}`;

    const options = {
      email: existingUser.email,
      subject: "New Verification Link",
      message: `Your new link: ${verificationUrl}`,
    };
    await emailQueue.add("sendEmail", { options });
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
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

export { getUser, signup, signin, signout, verifyEmail, resendEmail };
