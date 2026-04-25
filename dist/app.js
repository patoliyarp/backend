"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middleware/error.middleware");
const invalidRoute_middleware_1 = require("./middleware/invalidRoute.middleware");
const requestLogger_middleware_1 = require("./middleware/requestLogger.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
require("./services/eventEmitter");
require("./services/email.service");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
//Request Logger middleware
app.use(requestLogger_middleware_1.requestLoggerMiddleware);
//Routes imports
const index_route_1 = __importDefault(require("./routes/index.route"));
//Declare routes
app.use("/", index_route_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
//Handle invalid route error
app.use(invalidRoute_middleware_1.invalidRouteMiddleware);
//Global error handling middleware
app.use(error_middleware_1.errorMiddleware);
// import http from "http";
// const PORT = 3000;
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "content-Type": "text/plain" });
//   res.end("hello, this server is created using https");
// });
// server.listen(PORT, () => {
//   console.log(`server is running at https://localhost:${PORT}`);
// });
//# sourceMappingURL=app.js.map