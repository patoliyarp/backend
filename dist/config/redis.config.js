"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const dotenv_1 = require("dotenv");
const ioredis_1 = __importDefault(require("ioredis"));
(0, dotenv_1.configDotenv)();
function createConnection() {
    return new ioredis_1.default({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASS,
        // Critical settings for BullMQ
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });
}
// Shared connection for all components
exports.connection = createConnection();
//# sourceMappingURL=redis.config.js.map