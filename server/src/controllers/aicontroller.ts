import axios from "axios";
import { Request, Response } from "express";
import Transaction from "../models/transactionmodel";

export const summarizeTransactions = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transactions = await Transaction.find({ userId: id })
      .sort({ date: -1 })
      .limit(20);

    const prompt = `
      You are a financial assistant. Analyze the following transactions below and provide your insights for this weeks transactions in this format:
      1. Summary of spending habits
      2. Notable Transaction Expenses or Incomes
      3. Suggestions for budgeting or saving tips
      
      
      Transactions:
      ${transactions
        .map(
          (tx) =>
            `- ${tx.dateCreated.toISOString().split("T")[0]}: ${tx.type} of $${
              tx.amount
            } for ${tx.transactionName}`
        )
        .join("\n")}
      `;
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "qwen:4b",
      prompt: prompt,
      stream: false,
      num_predict: 500,
      temperature: 0.7,
      top_p: 0.9,
    });
    res.status(200).json({ summary: response.data.response });
  } catch (error) {
    console.error("Error communicating with Qwen API:", error);
    res.status(500).json({ error: "Failed to get summary from Qwen API" });
  }
};
