"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../config/redis.config");
//Sms queue to process sms
const smsQueue = new bullmq_1.Queue("smsQueue", { connection: redis_config_1.connection });
exports.default = smsQueue;
//# sourceMappingURL=smsQueue.js.map