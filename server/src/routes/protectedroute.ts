import express from "express";
import { authMiddleWare } from "../middleware/authMiddleware";
import { Request, Response } from "express";

const protectedRoute = express.Router();

protectedRoute.get(
  "/protected",
  authMiddleWare,
  (req: Request, res: Response) => {
    res.json({ message: "This is a protected route", user: req.user });
  }
);

export default protectedRoute;
