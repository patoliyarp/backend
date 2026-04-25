"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_config_1 = require("../config/redis.config");
//Email queue to process email 
const emailQueue = new bullmq_1.Queue("emailQueue", { connection: redis_config_1.connection });
exports.default = emailQueue;
//# sourceMappingURL=emailQueue.js.map