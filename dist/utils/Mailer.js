"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const dotenv_1 = require("dotenv");
const nodemailer_1 = __importDefault(require("nodemailer"));
(0, dotenv_1.configDotenv)();
//Send email helper function that execute in worker
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASS}`,
        },
    });
    //Email temple
    const htmltemplet = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://w3.org">
<html xmlns="http://w3.org">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Declare support for light/dark modes -->
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Email Verification</title>
    <!-- Embedded CSS for dark mode styles -->
    <style type="text/css">
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
        @media (prefers-color-scheme: dark) {
            .dark-mode-main {
                background-color: #121212 !important;
                color: #ffffff !important;
            }
            .dark-mode-text {
                color: #ffffff !important;
            }
            .dark-mode-button {
                background-color: #007bff !important;
                color: #ffffff !important;
            }
            .dark-mode-button-resend {
                background-color: #6c757d !important;
                color: #ffffff !important;
            }
            .dark-mode-link {
                color: #bbbbbb !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center style="width: 100%; table-layout: fixed; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; max-width: 600px; width: 100%; background-color: #ffffff;" class="dark-mode-main">
            <tr>
                <td align="center" style="padding: 40px 0 30px 0; color: #333333;" class="dark-mode-text">
                    <h1 style="font-family: Arial, sans-serif; font-size: 24px; margin: 0;">Verify Your Email Address</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 30px 40px 30px; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;" class="dark-mode-text">
                    <p style="margin: 0;">Hello,</p>
                    <p style="margin: 20px 0 0 0;">Please verify your email address by clicking the button below. This link will confirm your account creation.</p>
                    
                    <!-- Verify Email Button -->
                    <table border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
                        <tr>
                            <td align="center" style="border-radius: 5px;" bgcolor="#007bff">
                                <a href="${options.message}" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 12px 24px; border: 1px solid #007bff; display: inline-block; background-color: #007bff;" class="dark-mode-button">
                                    Verify Email
                                </a>
                            </td>
                        </tr>
                    </table>
                    <p style="margin: 0;">Thank you,<br/>Your Team</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;
    //Mail options
    const mailOptions = {
        from: "patoliya.rp@gmail.com",
        to: options.email,
        subject: options.subject,
        text: "This is the plain text body",
        html: `${htmltemplet}
          `,
    };
    return await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=Mailer.js.map