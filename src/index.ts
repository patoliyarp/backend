import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/db.config";
import { ApiError } from "./utils/ApiError";
import { connectRedis } from "./config/redisClient";
import { initRedisSubscriptions } from "./services/redisListener";

const port = process.env.PORT || 8000;
connectDB()
  .then(async () => {
    await connectRedis();
    await initRedisSubscriptions();

    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => new ApiError(`error while connect db:${err}`, 500));
