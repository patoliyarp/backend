"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readstream = readstream;
exports.readimage = readimage;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import log from "../../";
async function readstream(req, res, next) {
    const textfile = path_1.default.join(__dirname, "..", "..", "asset", "big-log-file.log");
    const readStream = fs_1.default.createReadStream(textfile, {
        highWaterMark: 1024,
    });
    readStream.on("data", (chunk) => {
        readStream.pause();
        setTimeout(() => {
            res.write(chunk);
            readStream.resume();
        }, 1000);
    });
    readStream.on("end", () => {
        res.end();
    });
    readStream.on("error", (error) => {
        next(error);
    });
}
async function readimage(req, res, next) {
    const picture = path_1.default.join(__dirname, "..", "..", "asset", "pic.jpg");
    const readstream = fs_1.default.createReadStream(picture, { highWaterMark: 1024 * 9 });
    readstream.on("data", (chunk) => {
        readstream.pause();
        setTimeout(() => {
            res.write(chunk);
            readstream.resume();
        }, 1000);
    });
    readstream.on("end", () => {
        res.end();
    });
    readstream.on("error", (error) => {
        next(error);
    });
}
//# sourceMappingURL=stream.controller.js.map