import winston, { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    critical: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

const msgFormat = format((info) => {
  info.msg = info.message;
  delete info.message;
  return info;
});

const logger = createLogger({
  levels: customLevels.levels,
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
    msgFormat(),
    // format.colorize({ all: true }),
    // format.printf(
    //   ({ timestamp, level, message }) => `${timestamp} ${level} : ${message}`,
    // ),
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "src/logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

winston.addColors(customLevels.colors);
export default logger;
