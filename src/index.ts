import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/db.config";
import { ApiError } from "./utils/ApiError";
import { connectRedis } from "./config/redisClient";
import { initRedisSubscriptions } from "./services/redisListener";
import { initializeRedisCache } from "./services/redisCache";
const port = process.env.PORT || 8000;
connectDB()
  .then(async () => {
    await connectRedis();
    await initRedisSubscriptions();
    console.log("controle rehch here");
    await initializeRedisCache();
    console.log("controle stop here dont move forveard");

    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => new ApiError(`error while connect db:${err}`, 500));
