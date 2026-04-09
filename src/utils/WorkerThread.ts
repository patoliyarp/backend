import { Worker } from "worker_threads";
import path from "path";

//Return worker result
function runWorker() {
  const workerPath = path.resolve(__dirname, "./Worker.ts");

  const worker = new Worker(workerPath, {
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
