import { Worker } from "bullmq";
import { sendSms } from "../utils/Messager";
import { connection } from "../config/redis.config";

//Create new worker using bull mq to send sms
const messageWorker = new Worker(
  "smsQueue",
  async (job) => {
    try {
      const { number } = job.data;

      //Send sms
      await sendSms(number);

      return "Sms processes successfully";
    } catch (error) {
      console.log("Failed to send Sms");
      throw error;
    }
  },
  { connection, concurrency: 50 },
);

messageWorker.on("completed", (job) => {
  console.log(`Job completed with id ${job.id}`);
});

messageWorker.on("failed", (job, err) => {
  console.error("Email job failed with id", job?.id, "error is:", err);
});
