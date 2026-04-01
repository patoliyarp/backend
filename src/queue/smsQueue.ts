import { Queue } from "bullmq";
import { connection } from "../config/redis.config";

//Sms queue to process sms
const smsQueue = new Queue("smsQueue", { connection });

export default smsQueue;
