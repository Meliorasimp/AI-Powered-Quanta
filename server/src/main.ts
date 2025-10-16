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

// Environment-aware URLs
const isDev = process.env.NODE_ENV !== "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = Number(process.env.PORT) || 5000;
const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  (isDev ? "http://localhost:11434" : "http://localhost:11434");

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

// Environment-aware CORS origins
const getAllowedOrigins = () => {
  const origins = [FRONTEND_URL];
  if (isDev) {
    origins.push(
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001"
    );
  } else {
    // Add common production frontend URLs
    origins.push(
      "https://your-frontend-domain.com", // Replace with your actual frontend URL
      "https://your-app.vercel.app", // If using Vercel
      "https://your-app.netlify.app" // If using Netlify
    );
  }
  return origins;
};

const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ["GET", "POST"],
  },
  pingTimeout: 120000,
  pingInterval: 25000,
  transports: ["polling", "websocket"],
});

// Test Ollama connectivity endpoint
app.get("/test-ollama", async (_req, res) => {
  try {
    console.log(`Testing Ollama connectivity from Render to: ${OLLAMA_URL}`);
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, {
      timeout: 10000,
    });
    res.json({
      success: true,
      ollamaUrl: OLLAMA_URL,
      models: response.data.models || [],
      status: "Ollama is reachable from Render",
    });
  } catch (error: any) {
    console.error("Ollama connectivity test failed:", error.message);
    res.status(500).json({
      success: false,
      ollamaUrl: OLLAMA_URL,
      error: error.message || "Unknown error",
      code: error.code || "UNKNOWN",
      status: "Ollama is NOT reachable from Render",
    });
  }
});

io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id);

  // Test ping endpoint
  socket.on("ping", (data) => {
    console.log("📍 Ping received from", socket.id, ":", data);
    socket.emit("pong", "Server is responding");
  });

  socket.on("UserMessage", async (message) => {
    try {
      console.log(
        `📨 Received message from ${socket.id}: "${message.content}"`
      );
      console.log(`🎯 Targeting Ollama at: ${OLLAMA_URL}`);

      const response = await axios.post(
        `${OLLAMA_URL}/api/generate`,
        {
          model: "qwen:4b",
          prompt: message.content,
          stream: false,
          num_predict: 1000,
          temperature: 0.7,
          top_p: 0.9,
        },
        {
          timeout: 180000, // 3 minutes for Ollama
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Ollama response received for ${socket.id}:`, {
        status: response.status,
        responseLength: response.data?.response?.length || 0,
        model: response.data?.model,
      });

      if (response.data?.response) {
        socket.emit("AIResponse", {
          role: "AI",
          content: response.data.response,
        });
      } else {
        console.error(
          `❌ Empty response from Ollama for ${socket.id}:`,
          response.data
        );
        socket.emit("AIResponse", {
          role: "AI",
          content: "Received empty response from AI service.",
        });
      }
    } catch (error: any) {
      console.error(`❌ AI error for ${socket.id}:`, {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: `${OLLAMA_URL}/api/generate`,
      });

      // Fallback to OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        try {
          console.log(`🔄 Falling back to OpenAI for ${socket.id}`);
          const openaiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: message.content }],
              max_tokens: 1000,
              temperature: 0.7,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              timeout: 30000,
            }
          );

          socket.emit("AIResponse", {
            role: "AI",
            content: openaiResponse.data.choices[0].message.content,
          });
          return;
        } catch (openaiError: any) {
          console.error(
            `❌ OpenAI fallback failed for ${socket.id}:`,
            openaiError.message
          );
        }
      }

      socket.emit("AIResponse", {
        role: "AI",
        content: `AI Error: ${error.message}. The service might be overloaded. Please try again.`,
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("👋 User disconnected:", socket.id, "Reason:", reason);
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: !isDev,
      sameSite: isDev ? "lax" : "none",
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

// Health endpoint with AI service status
app.get("/health", async (_req, res) => {
  let ollamaStatus = { available: false, error: null };

  try {
    await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    ollamaStatus.available = true;
  } catch (error: any) {
    ollamaStatus.error = error.message;
  }

  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    frontend: FRONTEND_URL,
    ollama: {
      url: OLLAMA_URL,
      ...ollamaStatus,
    },
    aiServices: {
      ollama: ollamaStatus.available,
      openai: !!process.env.OPENAI_API_KEY,
    },
  });
});

// Socket.io test endpoint
app.get("/test-socket", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Socket.io Test</title>
    </head>
    <body>
        <h1>Socket.io Connection Test</h1>
        <div id="status">Connecting...</div>
        <div id="log"></div>
        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          const status = document.getElementById('status');
          const log = document.getElementById('log');
          
          function addLog(message) {
            log.innerHTML += '<p>' + new Date().toLocaleTimeString() + ': ' + message + '</p>';
          }
          
          socket.on("connect", () => {
            status.textContent = "Connected: " + socket.id;
            addLog("Connected successfully");
          });
          
          socket.on("disconnect", () => {
            status.textContent = "Disconnected";
            addLog("Disconnected");
          });
          
          socket.on("connect_error", (error) => {
            status.textContent = "Connection Error";
            addLog("Connection error: " + error.message);
          });
          
          socket.emit("ping", "test from browser");
          
          socket.on("pong", (data) => {
            addLog("Pong received: " + data);
          });
        </script>
    </body>
    </html>
  `);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// DB + start
const MONGO_URI =
  process.env.MONGO_URI ||
  (isDev ? "mongodb://localhost:27017/quanta" : "mongodb://mongo:27017/quanta");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error connecting to MongoDB:", error));

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Frontend: ${FRONTEND_URL}`);
  console.log(`🤖 Ollama URL: ${OLLAMA_URL}`);
  console.log(`🗃️  Database: ${MONGO_URI}`);
  console.log(`🔌 Socket.io ready for connections`);
});
