import { parentPort, workerData } from "worker_threads";

console.log("worker received:", workerData);

function cpuIntensiveTask() {
  let sm = 0;
  for (let i = 0; i < workerData.num; i++) {
    sm += i;
  }
  return sm;
}

const result = cpuIntensiveTask();

//Sent result to main thread
parentPort?.postMessage({ receivedData: workerData, calculatedSum: result });
