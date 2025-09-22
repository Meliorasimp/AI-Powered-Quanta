import { Request, Response } from "express";
import { client } from "../main";
import Transaction from "../models/transactionmodel";
import mongoose from "mongoose";

export const summarizeTransactions = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Summarize transactions for user ID:", id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Valid user ID is required" });
  }

  try {
    const transactions = await Transaction.find({ userId: id }).limit(10);

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }

    const textData = transactions
      .map(
        (tx) =>
          `${tx.dateCreated.toDateString()}: ${tx.transactionName} of amount $${
            tx.amount
          } at ${tx.merchant} [${tx.type}, ${tx.status}]`
      )
      .join("\n");

    console.log("Transactions to summarize:\n", textData);

    async function runWithRetry(
      fn: () => Promise<any>,
      retries = 3,
      delay = 2000
    ) {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (err: any) {
          if (i < retries - 1 && err.message.includes("not ready")) {
            console.warn(`Model warming up, retrying in ${delay}ms...`);
            await new Promise((res) => setTimeout(res, delay));
          } else {
            throw err;
          }
        }
      }
    }

    const response = await runWithRetry(() =>
      client.chatCompletion({
        model: "Qwen/Qwen2.5-1.5B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a financial assistant that summarizes spending patterns clearly and concisely.",
          },
          {
            role: "user",
            content: `Here are the last ${transactions.length} transactions:\n${textData}\n\nPlease summarize spending patterns, highlight the largest expenses, and mention categories if possible.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      })
    );

    console.log("Hugging Face response:", JSON.stringify(response, null, 2));

    const summary =
      response?.choices?.[0]?.message?.content || "No summary generated";
    return res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};
