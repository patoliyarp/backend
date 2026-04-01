import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();

//Send email helper function that execute in worker
const sendWelcomeEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
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

export { sendWelcomeEmail };
