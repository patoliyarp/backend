"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheClient = exports.subscriber = exports.publisher = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
// const REDIS_URL = process.env.URL_REDIS_CONN;
const REDIS_URL = process.env.REDIS_ONLINE;
console.log("redis url", REDIS_URL);
//Create redis client
const redisClient = (0, redis_1.createClient)({ url: REDIS_URL });
redisClient.on("error", (err) => console.log("Redis connection error", err));
// Publisher for publish to channel
exports.publisher = (0, redis_1.createClient)({ url: REDIS_URL });
//Subscriber that listen from channel
exports.subscriber = (0, redis_1.createClient)({ url: REDIS_URL });
//Initialize client for redis cache
exports.cacheClient = (0, redis_1.createClient)({ url: REDIS_URL });
//Connect to redis server
async function connectRedis() {
    await Promise.all([
        exports.publisher.connect(),
        exports.subscriber.connect(),
        exports.cacheClient.connect(),
    ]);
}
//# sourceMappingURL=redisClient.js.map