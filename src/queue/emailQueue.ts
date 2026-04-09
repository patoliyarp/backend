import { Queue } from "bullmq";
import { connection } from "../config/redis.config";

//Email queue to process email 
const emailQueue = new Queue("emailQueue", { connection });

export default emailQueue;
