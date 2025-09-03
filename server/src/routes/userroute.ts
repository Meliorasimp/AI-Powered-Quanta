import {
  loginUser,
  postUserData,
  updateFullname,
  updateEmail,
  updatePassword,
} from "../controllers/usercontroller";
import express from "express";

const userRouter = express.Router();

userRouter.post("/users/register", postUserData);
userRouter.post("/users/login", loginUser);
userRouter.put("/users/updateFullName/:id", updateFullname);
userRouter.put("/users/updateEmail/:id", updateEmail);
userRouter.put("/users/updatePassword/:id", updatePassword);

export default userRouter;
