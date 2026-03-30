import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

//Create interface to add methods to schema
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  image_public_id: string;
  accessToken?: string;
  comparePassword(password: string): Promise<boolean>;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      min: [4, "Username must be at least 4 characters long."],
      max: [20, "Username cannot exceed 20 characters."],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(v);
        },
        message: (prop) =>
          `${prop.value} is not a valid username. Must start with a letter and contain only letters, numbers, or underscores.`,
      },
    },
    email: {
      type: String,
      required: [true, "Email required"],
      lowercase: true,
      unique: true,
      match: [/.+@.+\..+/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      min: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    image_public_id: {
      type: String,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true },
);

//Hash password just before save to database
userSchema.pre("save", async function () {
  if (this.isModified("password"))
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      throw new Error("Password hashing failed");
    }
});

//Add password compare method to userSchema
userSchema.methods.comparePassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

//Add generateRefreshToken method to userSchema
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
export const User = mongoose.model<IUser>("User", userSchema);
