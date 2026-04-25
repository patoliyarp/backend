"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
console.log("worker received:", worker_threads_1.workerData);
function cpuIntensiveTask() {
    let sm = 0;
    for (let i = 0; i < worker_threads_1.workerData.num; i++) {
        sm += i;
    }
    return sm;
}
const result = cpuIntensiveTask();
//Sent result to main thread
worker_threads_1.parentPort?.postMessage({ receivedData: worker_threads_1.workerData, calculatedSum: result });
//# sourceMappingURL=Worker.js.map