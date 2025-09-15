import {
  loginUser,
  postUserData,
  updateFullname,
  updateEmail,
  updatePassword,
  uploadProfilePicture,
  logoutUser,
} from "../controllers/usercontroller";
import upload from "../middleware/uploadMiddleware";
import express from "express";
const userRouter = express.Router();

userRouter.post("/users/register", postUserData);
userRouter.post("/users/login", loginUser);
userRouter.put("/users/updateFullName/:id", updateFullname);
userRouter.put("/users/updateEmail/:id", updateEmail);
userRouter.put("/users/updatePassword/:id", updatePassword);
userRouter.put(
  "/users/uploadProfilePicture/:id",
  upload.single("profilePicture"),
  uploadProfilePicture
);
userRouter.post("/logout", logoutUser);

export default userRouter;
