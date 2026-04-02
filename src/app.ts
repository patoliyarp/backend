import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { invalidRouteMiddleware } from "./middleware/invalidRoute.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

//Request Logger middleware
app.use(requestLoggerMiddleware);

//Routes imports
import userRoute from "./routes/user/user.route";
import postRoute from "./routes/posts/port.route";
import postsRouter from "./routes/posts/posts.route";
import streamRouter from "./routes/stream/stream.route";
import {
  authLimiter,
  publicLimiter,
  rateLimitMiddleware,
} from "./middleware/rateLimit.middleware";

//Declare routes
app.use("/api/user", authLimiter, userRoute);
app.use(rateLimitMiddleware);
app.use("/api/post", postRoute);
app.use("/api/v2/post", postsRouter);
app.use("/api/stream", streamRouter);

//Handle invalid route error
app.use(invalidRouteMiddleware);

//Global error handling middleware
app.use(errorMiddleware);

export { app };

// import http from "http";

// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "content-Type": "text/plain" });
//   res.end("hello, this server is created using https");
// });

// server.listen(PORT, () => {
//   console.log(`server is running at https://localhost:${PORT}`);
// });
