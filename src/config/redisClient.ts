import { createClient } from "redis";

const REDIS_URL = process.env.URL_REDIS_CONN;

const CHANNEL_NAME = "channel1";

//Create redis client
const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.log("Redis connection error", err));

// Publisher for publish to channel
export const publisher = createClient({ url: REDIS_URL });

//Subscriber that listen from channel
export const subscriber = createClient({ url: REDIS_URL });

//Connect to redis server
export async function connectRedis() {
  await Promise.all([publisher.connect(), subscriber.connect()]);
}
