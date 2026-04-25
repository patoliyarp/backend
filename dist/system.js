"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
console.log("--- Basic Info ---");
console.log(`Platform: ${os_1.default.platform()}`);
console.log(`Architecture: ${os_1.default.arch()}`);
console.log(`CPUs: ${os_1.default.cpus().length}`);
const UptimeSecond = os_1.default.uptime();
const UptimeHours = Math.floor((UptimeSecond % 3600) / 60);
const UptimeMin = Math.floor(UptimeSecond / 3600);
console.log(`Uptime:${UptimeHours}h ${UptimeMin}m`);
const totalMemGb = (os_1.default.totalmem() / 1024 ** 3).toFixed(2);
const freeMemGb = (os_1.default.freemem() / 1024 ** 3).toFixed(2);
console.log(`Memory: ${freeMemGb}GB free / ${totalMemGb}`);
//# sourceMappingURL=system.js.map