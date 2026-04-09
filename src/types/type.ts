import { JwtPayload } from "jsonwebtoken";

export interface DecodeToken {
  id?: string;
  email?: string;
  role?: string;
  iat: number;
  exp: number;
}

export interface UserToken {
  id: DecodeToken["id"];
  email: DecodeToken["email"];
  role: DecodeToken["role"];
}

export interface AuthRequest extends Request {
  user?: UserToken | JwtPayload;
}

export interface MailOptions {
  email: string;
  subject: string;
  message: string;
}
