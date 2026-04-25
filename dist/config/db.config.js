"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    try {
        const connectionInstance = await mongoose_1.default.connect(`${process.env.MONGODB_URL}`);
        console.log(`\n mongodb connect DB host :${connectionInstance.connection.host} and connection instance:${connectionInstance}`);
    }
    catch (error) {
        console.log("database connection error:", error);
        process.exit(1);
    }
}
//# sourceMappingURL=db.config.js.map