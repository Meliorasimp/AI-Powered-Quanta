import User, { IUser } from "../models/usermodel";
import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

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
  const token = generateToken(new Types.ObjectId(), email);
  try {
    const newUser: IUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error,
    });
  }
};

//if the user logged in, do this function
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = generateToken(new Types.ObjectId(), email);

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
