"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
(0, dotenv_1.configDotenv)();
//Send email helper function that execute in worker
const sendWelcomeEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASS}`,
        },
    });
    //Mail options
    const mailOptions = {
        from: "patoliya.rp@gmail.com",
        to: options.email,
        subject: options.subject,
        text: "This is the plain text body",
        html: `<b>${options.message}</b>`,
    };
    return await transporter.sendMail(mailOptions);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=WelcomeMail.js.map