import { Worker } from "bullmq";
import { connection } from "../config/redis.config";
import { sendEmail } from "../utils/Mailer";
import { sendWelcomeEmail } from "../utils/WelcomeMail";

//Create new worker using bull mq to send emails
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      // const { options } = job.data;
      switch (job.name) {
        case "sendEmail":
          await sendEmail(job.data.options);
          break;
        case "welcomeMail":
          await sendWelcomeEmail(job.data.options);
          break;
        default:
          console.log(`Unknown job name: ${job.name}`);
      }

      //Send email

      return "Email processes successfully";
    } catch (error) {
      console.log("Failed to send email");
      throw error;
    }
  },
  { connection, concurrency: 10 },
);

emailWorker.on("completed", (job) => {
  console.log(`Job completed with id ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error("Email job failed with id", job?.id, "error is:", err);
});
