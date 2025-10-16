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

// Ollama URL configuration for production deployment
const getOllamaUrl = () => {
  if (process.env.OLLAMA_URL) {
    return process.env.OLLAMA_URL;
  }

  // Default based on deployment type
  if (isDev) {
    return "http://localhost:11434";
  } else {
    // Production: try container service first, fallback to localhost
    return process.env.RAILWAY_PRIVATE_DOMAIN
      ? "http://ollama:11434" // Railway/Docker internal
      : process.env.RENDER_SERVICE_NAME
      ? "http://ollama:11434" // Render internal
      : "http://localhost:11434"; // VPS/dedicated server
  }
};

const OLLAMA_URL = getOllamaUrl();

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
  } catch (error) {
    console.error("Ollama connectivity test failed:", (error as any).message);
    res.status(500).json({
      success: false,
      ollamaUrl: OLLAMA_URL,
      error: (error as any).message,
      code: (error as any).code,
      status: "Ollama is NOT reachable from Render",
    });
  }
});

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

// Helper function to check if Ollama is available
const checkOllamaHealth = async (): Promise<boolean> => {
  try {
    await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn(
      `Ollama health check failed at ${OLLAMA_URL}:`,
      (error as any).message
    );
    return false;
  }
};

// Helper function to ensure model is available
const ensureModel = async (modelName: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`);
    const models = response.data.models || [];
    const modelExists = models.some((model: any) =>
      model.name.includes(modelName)
    );

    if (!modelExists) {
      console.log(`Pulling model ${modelName}...`);
      await axios.post(
        `${OLLAMA_URL}/api/pull`,
        { name: modelName },
        { timeout: 300000 }
      );
      console.log(`Model ${modelName} pulled successfully`);
    }

    return true;
  } catch (error) {
    console.error(
      `Failed to ensure model ${modelName}:`,
      (error as any).message
    );
    return false;
  }
};

io.on("connection", (socket) => {
  socket.on("UserMessage", async (message) => {
    try {
      console.log(`Making AI request to: ${OLLAMA_URL}`);

      // Check if Ollama is available
      const ollamaAvailable = await checkOllamaHealth();

      if (ollamaAvailable) {
        // Ensure model is available
        const modelReady = await ensureModel("qwen:4b");

        if (modelReady) {
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
              timeout: 60000, // Increased timeout for model loading
            }
          );

          socket.emit("AIResponse", {
            role: "AI",
            content: response.data.response,
          });
          return;
        }
      }

      // Fallback to OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        console.log("Falling back to OpenAI API");
        const response = await axios.post(
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
          content: response.data.choices[0].message.content,
        });
      } else {
        // No AI service available
        socket.emit("AIResponse", {
          role: "AI",
          content:
            "AI service is currently unavailable. Please check if Ollama is running or configure an OpenAI API key.",
        });
      }
    } catch (error) {
      console.error("AI API error:", error);
      socket.emit("AIResponse", {
        role: "AI",
        content:
          "Sorry, there was an error processing your request. Please try again later.",
      });
    }
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Environment-aware CORS
const getAllowedOrigins = () => {
  const origins = [FRONTEND_URL];
  if (isDev) {
    origins.push(
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001"
    );
  }
  return origins;
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
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
  const ollamaAvailable = await checkOllamaHealth();
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    frontend: FRONTEND_URL,
    ollama: {
      url: OLLAMA_URL,
      available: ollamaAvailable,
    },
    aiServices: {
      ollama: ollamaAvailable,
      openai: !!process.env.OPENAI_API_KEY,
    },
  });
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

server.listen(PORT, async () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Frontend: ${FRONTEND_URL}`);
  console.log(`🤖 Ollama URL: ${OLLAMA_URL}`);
  console.log(`🗃️  Database: ${MONGO_URI}`);

  // Check AI services on startup
  const ollamaAvailable = await checkOllamaHealth();
  console.log(
    `🤖 Ollama: ${ollamaAvailable ? "✅ Available" : "❌ Unavailable"}`
  );
  console.log(
    `🤖 OpenAI: ${
      process.env.OPENAI_API_KEY ? "✅ Configured" : "❌ Not configured"
    }`
  );

  if (ollamaAvailable) {
    console.log("🔄 Ensuring qwen:4b model is available...");
    await ensureModel("qwen:4b");
  }
});
