import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Request Logger middleware
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
app.use(requestLoggerMiddleware);

//Routes imports
import userRoute from "./routes/user/user.route";
import postRoute from "./routes/posts/port.route";

//Declare routes
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

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
