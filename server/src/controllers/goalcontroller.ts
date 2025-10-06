import Goal from "../models/goalmodel";
import { Request, Response } from "express";

export const postGoalData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    target,
    current,
    deadline,
    category,
    priority,
    frequency,
    notes,
  } = req.body;

  try {
    const newGoal = new Goal({
      name,
      target,
      current,
      deadline,
      category,
      priority,
      frequency,
      notes,
      userId: id,
    });
    await newGoal.save();
    res.status(201).json({
      message: "Goal created successfully",
      goal: newGoal,
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong", error: "Unknown error" });
    }
  }
};

export const getGoalData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const goals = await Goal.find({ userId: id });

    if (!goals) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.status(200).json({ goal: goals });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong", error: "Unknown error" });
    }
  }
};

export const allocateAmountToGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const amount = Number(req.body.amount);

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const goal = await Goal.findByIdAndUpdate(
      id,
      { $inc: { current: amount } },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Amount allocated successfully", goal });
  } catch (error) {
    console.error(error); // 👈 log the real error
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong", error: "Unknown error" });
    }
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedGoal = await Goal.findByIdAndDelete(id);
    if (!deleteGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res
      .status(200)
      .json({ message: "Goal deleted successfully", goal: deletedGoal });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong", error: "Unknown error" });
    }
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res
      .status(200)
      .json({ message: "Goal updated successfully", goal: updatedGoal });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong", error: "Unknown error" });
    }
  }
};
