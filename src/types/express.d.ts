import type { JwtPayload } from "jsonwebtoken";

declare global {
  export namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}
export {};
