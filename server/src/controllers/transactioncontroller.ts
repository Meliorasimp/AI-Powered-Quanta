import Transaction from "../models/transactionmodel";
import { Request, Response } from "express";

export const createTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { transactionName, amount, merchant, type, status } = req.body;

  try {
    const newTransaction = new Transaction({
      userId: id,
      transactionName,
      amount,
      merchant,
      type,
      status,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getUserTransactionsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Fetching transactions for user ID:", id);
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const userTransaction = await Transaction.find({ userId: id });
    if (!userTransaction) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }

    return res.status(200).json(userTransaction);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};
