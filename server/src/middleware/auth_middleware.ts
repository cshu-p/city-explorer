import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export type AuthedRequest = Request & {
  user: {
    id: number;
    username?: string;
  };
};

export interface AuthJwtPayload {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret_change_me"
    ) as AuthJwtPayload;

    req.user = {
      userId: payload.userId,
      username: payload.username,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
