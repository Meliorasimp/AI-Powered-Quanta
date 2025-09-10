import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface JWTPayload {
  id: string;
  email: string;
  username?: string;
  photo?: string;
}

export function authMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      photo: decoded.photo,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
