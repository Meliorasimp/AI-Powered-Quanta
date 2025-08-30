import "./config/googleAuth";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userroute";
import cors from "cors";
import session from "express-session";
import passport = require("passport");
import authRouter from "./routes/authRoute";
dotenv.config();

const app = express();
app.use(express.json());
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

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI as string;

app.use("/api", userRouter);
app.use("/api", authRouter);

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
