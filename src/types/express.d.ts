import { UserToken } from "./type";

declare global {
  namespace Express {
    export interface Request {
      user?: UserToken;
    }
  }
}
export {};
