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

export const getTransactionsByType = async (req: Request, res: Response) => {
  const { id, type } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!type) {
    return res.status(400).json({ message: "Transaction type is required" });
  }

  try {
    const transactions = await Transaction.find({
      userId: id,
      type: type.toLowerCase(),
    })
      .sort({ dateCreated: -1 })
      .lean();

    if (transactions.length === 0) {
      return res.status(404).json({
        message: `No ${type} transactions found for this user`,
      });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const getTransactionsByStatus = async (req: Request, res: Response) => {
  const { status, id } = req.params;
  console.log("Status param:", status);
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "Transaction status is required" });
  }
  try {
    const transactions = await Transaction.find({
      userId: id,
      status: status.toLowerCase(),
    })
      .sort({ dateCreated: -1 })
      .lean();
    if (transactions.length === 0) {
      return res.status(404).json({
        message: `No ${status} transactions found for this user`,
      });
    }
    return res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};
