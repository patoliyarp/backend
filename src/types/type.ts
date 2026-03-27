import { JwtPayload } from "jsonwebtoken";

export interface DecodeToken {
  id?: string;
  username?: string;
  email?: string;
  iat: number;
  exp: number;
}
