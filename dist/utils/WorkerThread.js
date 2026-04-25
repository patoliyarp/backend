"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
//Return worker result
function runWorker() {
    const workerPath = path_1.default.resolve(__dirname, "./Worker.ts");
    const worker = new worker_threads_1.Worker(workerPath, {
        execArgv: ["--import", "ts-node/esm"],
        workerData: { num: 5000000000 },
    });
    worker.on("message", (result) => {
        console.log("result of worker thread:", result);
    });
    worker.on("error", (msg) => {
        console.log("worker error:", msg);
    });
}
console.log("start main thread...");
console.log("work fast");
setInterval(() => {
    console.log("Main thread is NOT blocked!");
}, 500);
runWorker();
//# sourceMappingURL=WorkerThread.js.map