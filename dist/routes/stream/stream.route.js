"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_controller_1 = require("../../controller/stream/stream.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/readstream", stream_controller_1.readstream);
router.get("/readpicture", stream_controller_1.readimage);
exports.default = router;
//# sourceMappingURL=stream.route.js.map