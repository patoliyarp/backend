import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { invalidRouteMiddleware } from "./middleware/invalidRoute.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "./services/eventEmitter";
import "./services/email.service";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger-output.json";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

//Request Logger middleware
app.use(requestLoggerMiddleware);

//Routes imports
import mainRouter from "./routes/index.route";

//Declare routes
app.use("/", mainRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
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
