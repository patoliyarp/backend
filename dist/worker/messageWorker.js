"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const Messager_1 = require("../utils/Messager");
const redis_config_1 = require("../config/redis.config");
//Create new worker using bull mq to send sms
const messageWorker = new bullmq_1.Worker("smsQueue", async (job) => {
    try {
        const { number } = job.data;
        //Send sms
        await (0, Messager_1.sendSms)(number);
        return "Sms processes successfully";
    }
    catch (error) {
        console.log("Failed to send Sms");
        throw error;
    }
}, { connection: redis_config_1.connection, concurrency: 50 });
messageWorker.on("completed", (job) => {
    console.log(`Job completed with id ${job.id}`);
});
messageWorker.on("failed", (job, err) => {
    console.error("Email job failed with id", job?.id, "error is:", err);
});
//# sourceMappingURL=messageWorker.js.map