"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: "v1.0.0",
        title: "Learning Backend",
        description: "this  is a seamless platform that connects clients with verified legal experts, offering secure communication, easy appointment booking, transparent pricing, and comprehensive legal services all in one place.",
    },
    host: `localhost:${process.env.PORT || 3000}`,
    basePath: "/",
    schemes: ["http", "https"],
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["src/routes/index.route.ts"];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
//# sourceMappingURL=swagger.js.map