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
import goalRouter from "./routes/goalRoute";
import AiRouter from "./routes/aiRoute";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

// Load environment variables from .env file

dotenv.config();

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("UserMessage", async (message) => {
    console.log("Received message from user:", message);

    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "qwen:4b",
        prompt: message.content,
        stream: false,
        num_predict: 1000,
        temperature: 0.7,
        top_p: 0.9,
      });

      socket.emit("AIResponse", {
        role: "AI",
        content: response.data.response,
      });
    } catch (error) {
      console.error("Error communicating with Qwen API:", error);
      socket.emit("AIResponse", {
        role: "AI",
        content: "Sorry, there was an error processing your request.",
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const uri = process.env.MONGO_URI as string;

//routes

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", budgetRouter);
app.use("/user", protectedRoute);
app.use("/api", TransactionRouter);
app.use("/ai", AiRouter);
app.use("/goals", goalRouter);

//Health check!!!!!
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

//connect to the database

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server`);
});
