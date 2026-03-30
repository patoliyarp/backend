import type { JwtPayload } from "jsonwebtoken";
import { DecodeToken } from "./type";
import { UserToken } from "./type";

declare global {
  export namespace Express {
    interface Request {
      user?: UserToken | JwtPayload;
    }
  }
}
export {};
