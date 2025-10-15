import "./authentication/googleAuth";
import "./authentication/githubAuth";
import express, { NextFunction, Request, Response } from "express";
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

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = Number(process.env.PORT) || 5000;

const app = express();

// required so "secure" cookies work behind Render/Proxies
app.set("trust proxy", 1);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("UserMessage", async (message) => {
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

const corsOptions: cors.CorsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 3600000,
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

// routes
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", budgetRouter);
app.use("/user", protectedRoute);
app.use("/api", TransactionRouter);
app.use("/ai", AiRouter);
app.use("/goals", goalRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// JSON error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// connect DB and start server
mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error connecting to MongoDB:", error));

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
