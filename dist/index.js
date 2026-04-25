"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const db_config_1 = __importDefault(require("./config/db.config"));
const ApiError_1 = require("./utils/ApiError");
const redisClient_1 = require("./pubsub/redisClient");
const subscriber_1 = require("./pubsub/subscriber");
// import { initializeRedisCache } from "./services/redisCache";
const port = process.env.PORT || 8000;
(0, db_config_1.default)()
    .then(async () => {
    await (0, redisClient_1.connectRedis)();
    await (0, subscriber_1.initRedisSubscriptions)();
    // await initializeRedisCache();
    app_1.app.listen(port, () => {
        console.log(`server is running on http://localhost:${port}`);
    });
})
    .catch((err) => new ApiError_1.ApiError(`error while connect db:${err}`, 500));
//# sourceMappingURL=index.js.map