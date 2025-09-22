import "./authentication/googleAuth";
import "./authentication/githubAuth";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userroute";
import cors from "cors";
import session from "express-session";
import passport = require("passport");
import authRouter from "./routes/authRoute";
import budgetRouter from "./routes/budgetRoute";
import protectedRoute from "./routes/protectedroute";
import TransactionRouter from "./routes/transactionRoute";
import HFRouter from "./routes/huggingFaceRoute";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { InferenceClient } from "@huggingface/inference";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI as string;

//routes

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", budgetRouter);
app.use("/user", protectedRoute);
app.use("/api", TransactionRouter);
app.use("/hf", HFRouter);

//connect to the database

export const client = new InferenceClient(process.env.HF_API_KEY);

// A lightweight ping request
async function queryQwen() {
  try {
    const res = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-0.5B-Instruct",
      {
        inputs:
          "Summarize: I spent 1200 on groceries, earned 50000 salary, and 150 on transport.",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data);
  } catch (err: any) {
    console.error("❌ Qwen error:", err.response?.data || err.message);
  }
}

queryQwen();
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server`);
});
