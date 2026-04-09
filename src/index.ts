import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/db.config";
import { ApiError } from "./utils/ApiError";
import { connectRedis } from "./pubsub/redisClient";
import { initRedisSubscriptions } from "./pubsub/subscriber";
// import { initializeRedisCache } from "./services/redisCache";

const port = process.env.PORT || 8000;
connectDB()
  .then(async () => {
    await connectRedis();
    await initRedisSubscriptions();
    // await initializeRedisCache();

    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => new ApiError(`error while connect db:${err}`, 500));
