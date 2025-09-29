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
