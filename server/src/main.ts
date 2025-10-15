import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport = require("passport");
import cookieParser from "cookie-parser";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

// Load Passport strategies (safe here; they don't create Routers)
import "./authentication/googleAuth";
import "./authentication/githubAuth";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = Number(process.env.PORT) || 5000;

// Guard helpers
const guardMethods = (target: any, label: string) => {
  const methods = ["use", "get", "post", "put", "delete", "all"] as const;
  for (const m of methods) {
    const orig = target[m].bind(target);
    target[m] = (...args: any[]) => {
      if (typeof args[0] === "string" && /^https?:\/\//.test(args[0])) {
        const err = new Error(
          `Absolute URL passed to ${label}.${m}: ${args[0]}`
        );
        console.error(err.stack);
        throw err;
      }
      return orig(...args);
    };
  }
};

const app = express();
guardMethods(app as any, "app");

// Guard every Router BEFORE any routers are created/imported
const OriginalRouter: any = (express as any).Router;
(express as any).Router = function patchedRouter(this: any, options?: any) {
  const router = OriginalRouter.call(this, options);
  guardMethods(router as any, "router");
  return router;
} as unknown as typeof express.Router;

// required so "secure" cookies work behind Render/Proxies
app.set("trust proxy", 1);

// Now import routers (after guards are in place)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const userRouter = require("./routes/userroute").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const authRouter = require("./routes/authRoute").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const budgetRouter = require("./routes/budgetRoute").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protectedRoute = require("./routes/protectedroute").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TransactionRouter = require("./routes/transactionRoute").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const goalRouter = require("./routes/goalRoute").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AiRouter = require("./routes/aiRoute").default;

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, credentials: true },
});

io.on("connection", (socket) => {
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
    } catch {
      socket.emit("AIResponse", {
        role: "AI",
        content: "Sorry, there was an error processing your request.",
      });
    }
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
app.use(helmet({ contentSecurityPolicy: false }));

// routes
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", budgetRouter);
app.use("/user", protectedRoute);
app.use("/api", TransactionRouter);
app.use("/ai", AiRouter);
app.use("/goals", goalRouter);

// Health + errors
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// DB + start
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error connecting to MongoDB:", error));

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
