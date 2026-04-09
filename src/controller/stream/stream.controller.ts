import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
// import log from "../../";

export async function readstream(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const textfile = path.join(
    __dirname,
    "..",
    "..",
    "asset",
    "big-log-file.log",
  );

  const readStream = fs.createReadStream(textfile, {
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

export async function readimage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const picture = path.join(__dirname, "..", "..", "asset", "pic.jpg");

  const readstream = fs.createReadStream(picture, { highWaterMark: 1024*9 });

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
