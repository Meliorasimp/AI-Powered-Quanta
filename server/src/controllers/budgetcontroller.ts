import Budget from "../models/budgetmodel";
import { Request, Response } from "express";

export const createBudget = async (req: Request, res: Response) => {
  const { description, amount, dateCreated, category } = req.body;
  const userId = req.body.id;

  try {
    if (!description || !amount || !userId || !category) {
      return res.status(400).json({
        message: "Description, amount, userId, and category are required",
      });
    }
    const newBudget = new Budget({
      description,
      amount,
      dateCreated,
      userId,
      category,
    });
    const savedBudget = await newBudget.save();
    return res.status(201).json(savedBudget);
  } catch (error) {
    console.error("Failed to create budget:", error);
    return res.status(500).json({ message: "Failed to create budget" });
  }
};

export const getBudgetsByUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const budgets = await Budget.find({ userId });
    // Return an empty array with 200 status instead of 404 – a list endpoint
    // should indicate 'no items yet' rather than a missing resource error.
    if (budgets.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(budgets);
  } catch (error) {
    console.error("Failed to get budgets:", error);
    return res.status(500).json({ message: "Failed to get budgets" });
  }
};

export const deleteBudgetById = async (req: Request, res: Response) => {
  const budgetId = req.params.id;
  try {
    const deletedBudget = await Budget.findByIdAndDelete(budgetId);
    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return res.status(500).json({ message: "Failed to delete budget" });
  }
};

export const deductFromBudget = async (req: Request, res: Response) => {
  const { budgetId, amount } = req.body;

  try {
    if (!budgetId || amount === undefined) {
      return res
        .status(400)
        .json({ message: "budgetId and amount are required" });
    }
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    if (amount < 0) {
      return res
        .status(400)
        .json({ message: "Amount to deduct must be positive" });
    }
    if (budget.amount < amount) {
      return res
        .status(400)
        .json({
          message: "Insufficient budget to deduct the specified amount",
        });
    }
    budget.amount = budget.amount - amount;
    const updatedBudget = await budget.save();
    return res.status(200).json(updatedBudget);
  } catch (error) {
    console.error("Failed to deduct from budget:", error);
    return res.status(500).json({ message: "Failed to deduct from budget" });
  }
};
