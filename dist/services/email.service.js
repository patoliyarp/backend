"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventEmitter_1 = __importDefault(require("./eventEmitter"));
const WelcomeMail_1 = require("../utils/WelcomeMail");
const logger_config_1 = __importDefault(require("../config/logger.config"));
//Listen signup events
eventEmitter_1.default.on("userSignup", async (options) => {
    try {
        await (0, WelcomeMail_1.sendWelcomeEmail)(options);
    }
    catch (error) {
        logger_config_1.default.error(error);
    }
});
//# sourceMappingURL=email.service.js.map