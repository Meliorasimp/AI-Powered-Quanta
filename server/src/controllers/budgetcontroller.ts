import Budget from "../models/budgetmodel";
import { Request, Response } from "express";

export const createBudget = async (req: Request, res: Response) => {
  const { description, amount, dateCreated } = req.body;
  const userId = req.body.id;

  try {
    if (!description || !amount || !userId) {
      return res
        .status(400)
        .json({ message: "Description, amount, and userId are required" });
    }
    const newBudget = new Budget({ description, amount, dateCreated, userId });
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

    if (budgets.length === 0) {
      return res.status(404).json({
        message: "No budgets found for this user, Start creating some!",
      });
    }

    return res.status(200).json(budgets);
  } catch (error) {
    console.error("Failed to get budgets:", error);
    return res.status(500).json({ message: "Failed to get budgets" });
  }
};

export const deleteBudgetById = async (req: Request, res: Response) => {
  const budgetId = req.params.id;
  console.log("Deleting budget with ID:", budgetId);

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
