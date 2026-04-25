"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRedisSubscriptions = initRedisSubscriptions;
const logger_config_1 = __importDefault(require("../config/logger.config"));
const redisClient_1 = require("./redisClient");
const WelcomeMail_1 = require("../utils/WelcomeMail");
//Initialize redis subscription
async function initRedisSubscriptions() {
    //Listen published event from channel userSignup
    await redisClient_1.subscriber.subscribe("userSignup", async (message) => {
        const options = JSON.parse(message);
        try {
            //Send welcome email
            await (0, WelcomeMail_1.sendWelcomeEmail)(options);
        }
        catch (error) {
            logger_config_1.default.error(error);
        }
    });
}
//# sourceMappingURL=subscriber.js.map