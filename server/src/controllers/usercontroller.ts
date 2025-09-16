import User, { IUser } from "../models/usermodel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import s3 from "../utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

//function to generate a token when the user registers or logs in

function generateToken(id: string | Types.ObjectId, email: string) {
  return jwt.sign({ id: id.toString(), email }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

//if the user registers, do this function
export const postUserData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newUser: IUser = new User({ username, email, password });
    if (!newUser) {
      res.status(400).json({ message: "User creation failed" });
      return;
    }
    await newUser.save();

    const token = generateToken(newUser.id, email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error,
    });
  }
};

//if the user logged in, do this function
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // token will be generated after verifying the user, using the actual user id

  try {
    const useremail = await User.findOne({ email });

    if (!useremail) {
      res.status(404).json({
        message: "Email or Password is Incorrect.",
      });
      return;
    }

    const isMatchedPassword = await useremail.comparePassword(password);
    if (!isMatchedPassword) {
      return res
        .status(400)
        .json({ message: "Email or Password is Incorrect." });
    }

    const token = generateToken(useremail.id, email);

    // Set httpOnly cookie so protected route can read it server-side
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: useremail._id,
        email: useremail.email,
        username: useremail.username,
      },
      token,
    });
    console.log("User logged in:", useremail);
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error,
    });
  }
};

//method to update the fullname in the profile page
export const updateFullname = async (req: Request, res: Response) => {
  const { firstname, lastname } = req.body;
  const { id } = req.params;

  try {
    const updatedFullname = await User.findByIdAndUpdate(
      id,
      { firstname, lastname },
      { new: true }
    );

    if (!updatedFullname) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Full name updated successfully",
      user: {
        id: updatedFullname._id,
        firstname: updatedFullname.firstname,
        lastname: updatedFullname.lastname,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//method to update the email in the profile page
export const updateEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const updatedEmail = await User.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json({
      message: "Email updated successfully",
      user: {
        id: updatedEmail._id,
        email: updatedEmail.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//method to update the password in the profile page
export const updatePassword = async (req: Request, res: Response) => {
  console.log("Received user ID:", req.params.id);

  const { currentpassword, newpassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Current password from request:", currentpassword);
    console.log("User.password from DB:", user.password);

    const isMatch = await bcrypt.compare(currentpassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newpassword, salt);

    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Update password error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message || error.toString(),
    });
  }
};

//method to upload profile picture in the profile page
export const uploadProfilePicture = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Incoming upload request for user:", req.params.id);
  console.log("File info:", req.file);

  const { originalname, buffer, mimetype } = req.file;
  const filename = `${Date.now()}_${originalname}`;
  const key = `uploads/${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  try {
    await s3.send(command);

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.status(200).json({ url });
  } catch (error: any) {
    console.error("Upload error:", error.name, error.message, error.stack);
    res.status(500).json({
      message: "Upload failed",
      error: error.message || "Unknown error",
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("connect.sid");
  req.logOut((err) => {
    if (err)
      return res.status(500).json({ message: "Error logging out", error: err });
    req.session?.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
