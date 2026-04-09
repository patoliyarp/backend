import os from "os";

console.log("--- Basic Info ---");
console.log(`Platform: ${os.platform()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`CPUs: ${os.cpus().length}`);

const UptimeSecond = os.uptime();
const UptimeHours = Math.floor((UptimeSecond % 3600) / 60);
const UptimeMin = Math.floor(UptimeSecond / 3600);
console.log(`Uptime:${UptimeHours}h ${UptimeMin}m`);

const totalMemGb = (os.totalmem() / 1024 ** 3).toFixed(2);
const freeMemGb = (os.freemem() / 1024 ** 3).toFixed(2);

console.log(`Memory: ${freeMemGb}GB free / ${totalMemGb}`);
