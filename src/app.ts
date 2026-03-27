import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { invalidRouteMiddleware } from "./middleware/invalidRoute.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Request Logger middleware
app.use(requestLoggerMiddleware);

//Routes imports
import userRoute from "./routes/user/user.route";
import postRoute from "./routes/posts/port.route";
import postsRouter from "./routes/posts/posts.route";

//Declare routes
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/v2/post", postsRouter);

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
