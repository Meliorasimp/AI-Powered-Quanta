import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import User from "../models/usermodel";

dotenv.config();

interface JWTPayload {
  id: string;
  email: string;
  username?: string;
  photo?: string;
}

export async function authMiddleWare(
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

    const dbUser = await User.findById(decoded.id).lean();
    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email ?? dbUser.email,
      username: decoded.username ?? dbUser.username,
      photo:
        decoded.photo ??
        dbUser.googlePhoto ??
        dbUser.githubPhoto ??
        dbUser.profilepicture,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
