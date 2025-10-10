import "../../styles/index.css";
import Qwen from "../../assets/qwen.svg";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { addMessages, Message } from "../../modules/Interaction.ts/dashboard";

// Single shared socket instance (module scope). Consider moving URL to env var.
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const AiModal = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.username);
  const messages = useAppSelector((state) => state.dashboard.messages);
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState<
    "connected" | "connecting" | "error"
  >("connecting");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const generateId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  useEffect(() => {
    const handleConnect = () => {
      setConnectionState("connected");
      console.log("Connected to server with ID:", socket.id);
    };

    const handleError = (err: unknown) => {
      console.error("Socket error", err);
      setConnectionState("error");
    };

    const handleAIResponse = (data: { role: "AI"; content: string }) => {
      const aiMessage: Message = {
        id: generateId(),
        role: "AI",
        content: data.content,
      };
      dispatch(addMessages(aiMessage));
      console.log("Received AI Response:", data, socket.id);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);
    socket.on("error", handleError);
    socket.on("AIResponse", handleAIResponse);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
      socket.off("error", handleError);
      socket.off("AIResponse", handleAIResponse);
    };
  }, [dispatch]);

  useEffect(() => {
    //auto scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
    };
    dispatch(addMessages(userMessage));
    socket.emit("UserMessage", userMessage);
    console.log("Sent message to server:", userMessage);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

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
        <div className="text-xs text-gray-300 italic">
          {connectionState === "connected" && (
            <span className="text-emerald-400">online</span>
          )}
          {connectionState === "connecting" && (
            <span className="text-amber-300">connecting...</span>
          )}
          {connectionState === "error" && (
            <span className="text-rose-400">connection error</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-10">
            Ask me anything about your finances, {username || "guest"}.
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
                  : "bg-gray-800/70 text-gray-100 border border-gray-700"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message and press Enter..."
            className="flex-1 p-3 bg-gray-900/70 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={connectionState === "error"}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white hover:bg-blue-500 transition-colors"
          >
            Send
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
