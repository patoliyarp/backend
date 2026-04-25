"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// user.controller.test.ts
const globals_1 = require("@jest/globals");
const user_controller_1 = require("../controller/user/user.controller");
const user_models_1 = require("../models/user.models");
const Cloudinary_1 = require("../utils/Cloudinary");
const emailQueue_1 = __importDefault(require("../queue/emailQueue"));
const smsQueue_1 = __importDefault(require("../queue/smsQueue"));
const redisClient_1 = require("../pubsub/redisClient");
// ================= MOCK DEPENDENCIES =================
globals_1.jest.mock("../models/user.models");
globals_1.jest.mock("../utils/Cloudinary");
globals_1.jest.mock("../queue/emailQueue");
globals_1.jest.mock("../queue/smsQueue");
globals_1.jest.mock("../pubsub/redisClient");
// Typed mocks
const mockedUser = user_models_1.User;
const mockedUpload = globals_1.jest.mocked(Cloudinary_1.UploadToCloudinary);
const mockedEmailQueue = emailQueue_1.default;
const mockedSmsQueue = smsQueue_1.default;
const mockedPublisher = redisClient_1.publisher;
// ================= HELPERS =================
const mockRequest = (body = {}, params = {}, file) => ({
    body,
    params,
    file,
    protocol: "http",
    get: globals_1.jest.fn((name) => name === "host" ? "localhost:3000" : undefined),
});
const mockResponse = () => {
    const res = {};
    res.status = globals_1.jest.fn().mockReturnValue(res);
    res.json = globals_1.jest.fn().mockReturnValue(res);
    res.cookie = globals_1.jest.fn().mockReturnValue(res);
    res.clearCookie = globals_1.jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = globals_1.jest.fn();
// ================= TEST SUITE =================
(0, globals_1.describe)("User Controller", () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    // ================= SIGNUP =================
    (0, globals_1.describe)("signup", () => {
        (0, globals_1.it)("should return error if fields are missing", async () => {
            const req = mockRequest({ username: "", email: "", password: "" });
            const res = mockResponse();
            await (0, user_controller_1.signup)(req, res, mockNext);
            (0, globals_1.expect)(mockNext).toHaveBeenCalled();
        });
        (0, globals_1.it)("should return 409 if user exists", async () => {
            const existingUser = { username: "test", email: "test@test.com" };
            mockedUser.findOne.mockResolvedValue(existingUser);
            const req = mockRequest({
                username: "test",
                email: "test@test.com",
                password: "123456",
            });
            const res = mockResponse();
            await (0, user_controller_1.signup)(req, res, mockNext);
            (0, globals_1.expect)(mockedUser.findOne).toHaveBeenCalled();
            (0, globals_1.expect)(mockNext).toHaveBeenCalled();
        });
        (0, globals_1.it)("should create user successfully", async () => {
            mockedUser.findOne.mockResolvedValue(null);
            mockedUpload.mockResolvedValue({
                secure_url: "url",
                public_id: "id",
            });
            const mockUserDoc = {
                username: "test",
                email: "test@test.com",
                getVerificationToken: globals_1.jest.fn().mockReturnValue("token"),
                save: globals_1.jest.fn(undefined).mockResolvedValue(undefined),
            };
            mockedUser.create.mockResolvedValue(mockUserDoc);
            const req = mockRequest({
                username: "test",
                email: "test@test.com",
                password: "123456",
                mobile: "9999999999",
            }, {}, { buffer: Buffer.from("img") });
            const res = mockResponse();
            await (0, user_controller_1.signup)(req, res, mockNext);
            (0, globals_1.expect)(mockedUser.create).toHaveBeenCalled();
            (0, globals_1.expect)(mockedEmailQueue.add).toHaveBeenCalled();
            (0, globals_1.expect)(mockedSmsQueue.add).toHaveBeenCalled();
            (0, globals_1.expect)(res.status).toHaveBeenCalledWith(200);
        });
    });
    // ================= SIGNIN =================
    (0, globals_1.describe)("signin", () => {
        (0, globals_1.it)("should fail if user not found", async () => {
            mockedUser.findOne.mockResolvedValue(null);
            const req = mockRequest({
                UsernameOrEmail: "test",
                password: "123456",
            });
            const res = mockResponse();
            await (0, user_controller_1.signin)(req, res, mockNext);
            (0, globals_1.expect)(mockNext).toHaveBeenCalled();
        });
        (0, globals_1.it)("should login successfully", async () => {
            const mockUserDoc = {
                comparePassword: globals_1.jest.fn(undefined).mockResolvedValue(true),
                generateRefreshToken: globals_1.jest.fn().mockReturnValue("token"),
            };
            mockedUser.findOne.mockResolvedValue(mockUserDoc);
            const req = mockRequest({
                UsernameOrEmail: "test",
                password: "123456",
            });
            const res = mockResponse();
            await (0, user_controller_1.signin)(req, res, mockNext);
            (0, globals_1.expect)(res.cookie).toHaveBeenCalled();
            (0, globals_1.expect)(res.status).toHaveBeenCalledWith(200);
        });
    });
    // ================= VERIFY EMAIL =================
    (0, globals_1.describe)("verifyEmail", () => {
        (0, globals_1.it)("should fail if token invalid", async () => {
            mockedUser.findOne.mockResolvedValue(null);
            const req = mockRequest({}, { token: "abc" });
            const res = mockResponse();
            await (0, user_controller_1.verifyEmail)(req, res, mockNext);
            (0, globals_1.expect)(mockNext).toHaveBeenCalled();
        });
        (0, globals_1.it)("should verify email successfully", async () => {
            const mockUserDoc = {
                isVerified: false,
                verificationTokenExpire: new Date(Date.now() + 10000),
                save: globals_1.jest.fn(undefined).mockResolvedValue(undefined),
                email: "test@test.com",
            };
            mockedUser.findOne.mockResolvedValue(mockUserDoc);
            const req = mockRequest({}, { token: "abc" });
            const res = mockResponse();
            await (0, user_controller_1.verifyEmail)(req, res, mockNext);
            (0, globals_1.expect)(mockedPublisher.publish).toHaveBeenCalled();
            (0, globals_1.expect)(res.status).toHaveBeenCalledWith(200);
        });
    });
});
//# sourceMappingURL=signin.test.js.map