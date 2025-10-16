import "../../styles/index.css";
import Qwen from "../../assets/qwen.svg";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  addMessages,
  clearMessages,
  Message,
} from "../../modules/Interaction.ts/dashboard";

// Enhanced socket configuration with better error handling
const socket = io(
  import.meta.env.VITE_API_URL || "https://ai-powered-quanta-2.onrender.com",
  {
    transports: ["polling", "websocket"], // Try polling first, then websocket
    timeout: 120000, // 2 minutes
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    forceNew: true,
    withCredentials: true,
  }
);

const AiModal = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.username);
  const messages = useAppSelector((state) => state.dashboard.messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionState, setConnectionState] = useState<
    "connected" | "connecting" | "error" | "reconnecting"
  >("connecting");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  useEffect(() => {
    console.log("🔌 Initializing socket connection...");

    const handleConnect = () => {
      setConnectionState("connected");
      console.log("✅ Connected to server with ID:", socket.id);
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ Disconnected:", reason);
      setConnectionState("connecting");
      setIsLoading(false);
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleConnectError = (err: unknown) => {
      console.error("❌ Socket connection error:", err);
      setConnectionState("error");
      setIsLoading(false);
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleReconnect = (attemptNumber: number) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      setConnectionState("connected");
    };

    const handleReconnecting = (attemptNumber: number) => {
      console.log("🔄 Attempting to reconnect... attempt", attemptNumber);
      setConnectionState("reconnecting");
    };

    const handleReconnectError = (err: unknown) => {
      console.error("🔄❌ Reconnection failed:", err);
      setConnectionState("error");
    };

    const handleAIResponse = (data: { role: "AI"; content: string }) => {
      setIsLoading(false);

      // Clear timeout when response arrives
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Handle error responses
      if (
        data.content.includes("AI Error:") ||
        data.content.includes("timeout") ||
        data.content.includes("error")
      ) {
        const errorMessage: Message = {
          id: generateId(),
          role: "system", // ✅ Fixed: Use specific string instead of union syntax
          content: `🔧 ${data.content}\n\n💡 Try:\n• Check your internet connection\n• Wait a moment and try again\n• Use simpler queries`,
        };
        dispatch(addMessages(errorMessage));
        return;
      }

      const aiMessage: Message = {
        id: generateId(),
        role: "AI",
        content: data.content,
      };
      dispatch(addMessages(aiMessage));
      console.log("✅ Received AI Response:", data);
    };

    // Test ping/pong
    const handlePong = (data: string) => {
      console.log("📍 Pong received:", data);
    };

    // Add all event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect", handleReconnect);
    socket.on("reconnecting", handleReconnecting);
    socket.on("reconnect_error", handleReconnectError);
    socket.on("AIResponse", handleAIResponse);
    socket.on("pong", handlePong);

    // Test connection
    if (socket.connected) {
      setConnectionState("connected");
    } else {
      socket.emit("ping", "test from frontend");
    }

    return () => {
      // Clear timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect", handleReconnect);
      socket.off("reconnecting", handleReconnecting);
      socket.off("reconnect_error", handleReconnectError);
      socket.off("AIResponse", handleAIResponse);
      socket.off("pong", handlePong);
    };
  }, [dispatch]);

  useEffect(() => {
    // Auto scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || connectionState !== "connected") return;

    console.log("📤 Sending message:", trimmed);

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
    };

    dispatch(addMessages(userMessage));
    setIsLoading(true);
    setInput("");

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set client-side timeout
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      const timeoutMessage: Message = {
        id: generateId(),
        role: "system",
        content:
          "⏰ Request timed out. Please try again with a simpler question.",
      };
      dispatch(addMessages(timeoutMessage));
      timeoutRef.current = null;
    }, 120000); // 2 minutes

    socket.emit("UserMessage", { content: trimmed });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "text-emerald-400";
      case "connecting":
        return "text-amber-300";
      case "reconnecting":
        return "text-blue-400";
      case "error":
        return "text-rose-400";
      default:
        return "text-gray-400";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case "connected":
        return "online";
      case "connecting":
        return "connecting...";
      case "reconnecting":
        return "reconnecting...";
      case "error":
        return "connection error";
      default:
        return "unknown";
    }
  };

  const retryConnection = () => {
    setConnectionState("connecting");
    socket.disconnect();
    socket.connect();
  };

  const clearChat = () => {
    dispatch(clearMessages()); // ✅ Use proper Redux action instead of reload
  };

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 ai-modal-background flex flex-col w-full md:w-1/2 h-full mt-20 md:ml-10 z-10 rounded-2xl shadow-lg border border-gray-700/40 backdrop-blur-sm">
      {/* Header */}
      <div className="h-14 w-full items-center flex flex-row ai-modal-header px-5 rounded-t-2xl justify-between">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full mr-3 overflow-hidden ring-2 ring-white/20">
            <img
              src={Qwen}
              alt="AI Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-white text-lg font-semibold">Qwen Bot</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-xs italic ${getConnectionStatusColor()}`}>
            {getConnectionStatusText()}
          </div>
          {connectionState === "error" && (
            <button
              onClick={retryConnection}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              type="button"
            >
              Retry
            </button>
          )}
          <button
            onClick={clearChat}
            className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
            title="Clear chat"
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-10">
            <p>Ask me anything about your finances, {username || "guest"}.</p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Try asking:</p>
              <ul className="mt-2 space-y-1">
                <li>• "How much did I spend this month?"</li>
                <li>• "Show me my budget breakdown"</li>
                <li>• "What are my savings goals?"</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-blue-600 text-white shadow-md"
                  : m.role === "system"
                  ? "bg-orange-900/50 text-orange-200 border border-orange-700/50"
                  : "bg-gray-800/70 text-gray-100 border border-gray-700"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/70 text-gray-100 border border-gray-700 rounded-xl px-4 py-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-5 pb-5">
        {connectionState === "error" && (
          <div className="mb-3 p-3 bg-rose-900/30 border border-rose-700/50 rounded-xl text-sm text-rose-200">
            ⚠️ Connection lost. Click "Retry" to reconnect or check your
            internet connection.
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              connectionState === "connected"
                ? "Type your message and press Enter..."
                : "Connecting to AI service..."
            }
            className="flex-1 p-3 bg-gray-900/70 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={connectionState !== "connected" || isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={
              !input.trim() || connectionState !== "connected" || isLoading
            }
            className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white hover:bg-blue-500 transition-colors"
            type="button"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default AiModal;
