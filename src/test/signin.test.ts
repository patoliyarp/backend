// user.controller.test.ts
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

import {
  signup,
  signin,
  verifyEmail,
} from "../controller/user/user.controller";
import { IUser, User } from "../models/user.models";
import { UploadToCloudinary } from "../utils/Cloudinary";
import emailQueue from "../queue/emailQueue";
import smsQueue from "../queue/smsQueue";
import { publisher } from "../pubsub/redisClient";

// ================= MOCK DEPENDENCIES =================
jest.mock("../models/user.models");
jest.mock("../utils/Cloudinary");
jest.mock("../queue/emailQueue");
jest.mock("../queue/smsQueue");
jest.mock("../pubsub/redisClient");

// Typed mocks
const mockedUser = User as jest.Mocked<typeof User>;
const mockedUpload = jest.mocked(UploadToCloudinary);
const mockedEmailQueue = emailQueue as jest.Mocked<typeof emailQueue>;
const mockedSmsQueue = smsQueue as jest.Mocked<typeof smsQueue>;
const mockedPublisher = publisher as jest.Mocked<typeof publisher>;

// ================= HELPERS =================
const mockRequest = (
  body: any = {},
  params: any = {},
  file?: any,
): Partial<Request> => ({
  body,
  params,
  file,
  protocol: "http",
  get: jest.fn((name: string) =>
    name === "host" ? "localhost:3000" : undefined,
  ) as Request["get"],
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as Response["status"];
  res.json = jest.fn().mockReturnValue(res) as Response["json"];
  res.cookie = jest.fn().mockReturnValue(res) as Response["cookie"];
  res.clearCookie = jest.fn().mockReturnValue(res) as Response["clearCookie"];
  return res;
};

const mockNext: NextFunction = jest.fn();

// ================= TEST SUITE =================
describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ================= SIGNUP =================
  describe("signup", () => {
    it("should return error if fields are missing", async () => {
      const req = mockRequest({ username: "", email: "", password: "" });
      const res = mockResponse();

      await signup(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 409 if user exists", async () => {
      const existingUser = { username: "test", email: "test@test.com" } as any;
      mockedUser.findOne.mockResolvedValue(existingUser);

      const req = mockRequest({
        username: "test",
        email: "test@test.com",
        password: "123456",
      });
      const res = mockResponse();

      await signup(req as Request, res as Response, mockNext);

      expect(mockedUser.findOne).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should create user successfully", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      mockedUpload.mockResolvedValue({
        secure_url: "url",
        public_id: "id",
      } as any);

      const mockUserDoc = {
        username: "test",
        email: "test@test.com",
        getVerificationToken: jest.fn().mockReturnValue("token"),
        save: jest.fn(undefined).mockResolvedValue(undefined),
      } as any;

      mockedUser.create.mockResolvedValue(mockUserDoc);

      const req = mockRequest(
        {
          username: "test",
          email: "test@test.com",
          password: "123456",
          mobile: "9999999999",
        },
        {},
        { buffer: Buffer.from("img") },
      );

      const res = mockResponse();

      await signup(req as Request, res as Response, mockNext);

      expect(mockedUser.create).toHaveBeenCalled();
      expect(mockedEmailQueue.add).toHaveBeenCalled();
      expect(mockedSmsQueue.add).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ================= SIGNIN =================
  describe("signin", () => {
    it("should fail if user not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      const req = mockRequest({
        UsernameOrEmail: "test",
        password: "123456",
      });

      const res = mockResponse();

      await signin(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should login successfully", async () => {
      const mockUserDoc = {
        comparePassword: jest.fn(undefined).mockResolvedValue(true),
        generateRefreshToken: jest.fn().mockReturnValue("token"),
      } as unknown as Awaited<ReturnType<typeof User.findOne>>;

      mockedUser.findOne.mockResolvedValue(mockUserDoc);

      const req = mockRequest({
        UsernameOrEmail: "test",
        password: "123456",
      });

      const res = mockResponse();

      await signin(req as Request, res as Response, mockNext);

      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ================= VERIFY EMAIL =================
  describe("verifyEmail", () => {
    it("should fail if token invalid", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      const req = mockRequest({}, { token: "abc" });
      const res = mockResponse();

      await verifyEmail(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should verify email successfully", async () => {
      const mockUserDoc = {
        isVerified: false,
        verificationTokenExpire: new Date(Date.now() + 10000),
        save: jest.fn(undefined).mockResolvedValue(undefined),
        email: "test@test.com",
      } as unknown as Awaited<ReturnType<typeof User.findOne>>;

      mockedUser.findOne.mockResolvedValue(mockUserDoc);

      const req = mockRequest({}, { token: "abc" });
      const res = mockResponse();

      await verifyEmail(req as Request, res as Response, mockNext);

      expect(mockedPublisher.publish).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
