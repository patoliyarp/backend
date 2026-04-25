"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../config/redis.config");
const Mailer_1 = require("../utils/Mailer");
const WelcomeMail_1 = require("../utils/WelcomeMail");
//Create new worker using bull mq to send emails
const emailWorker = new bullmq_1.Worker("emailQueue", async (job) => {
    try {
        // const { options } = job.data;
        switch (job.name) {
            case "sendEmail":
                await (0, Mailer_1.sendEmail)(job.data.options);
                break;
            case "welcomeMail":
                await (0, WelcomeMail_1.sendWelcomeEmail)(job.data.options);
                break;
            default:
                console.log(`Unknown job name: ${job.name}`);
        }
        //Send email
        return "Email processes successfully";
    }
    catch (error) {
        console.log("Failed to send email");
        throw error;
    }
}, { connection: redis_config_1.connection, concurrency: 10 });
emailWorker.on("completed", (job) => {
    console.log(`Job completed with id ${job.id}`);
});
emailWorker.on("failed", (job, err) => {
    console.error("Email job failed with id", job?.id, "error is:", err);
});
//# sourceMappingURL=emailWorker.js.map