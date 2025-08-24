import { loginUser, postUserData } from "../controllers/usercontroller";
import express from "express";

const userRouter = express.Router();

userRouter.post("/users/register", postUserData);
userRouter.post("/users/login", loginUser);

export default userRouter;
