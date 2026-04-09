import { configDotenv } from "dotenv";
import Redis from "ioredis";

configDotenv();
function createConnection(): Redis {
  return new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASS,
    // Critical settings for BullMQ
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

// Shared connection for all components
export const connection = createConnection();
