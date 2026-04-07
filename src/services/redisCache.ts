import redis, { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisCacheClient = createClient({ url: REDIS_URL });

//Listen error on connection
redisCacheClient.on("error", (err) =>
  console.log("Redis connection error", err),
);

export async function initializeRedisCache() {
  await redisCacheClient.connect();
}
