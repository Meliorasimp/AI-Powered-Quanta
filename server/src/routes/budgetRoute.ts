import {
  createBudget,
  deleteBudgetById,
  getBudgetsByUser,
} from "../controllers/budgetcontroller";
import express from "express";

const budgetRouter = express.Router();

budgetRouter.post("/budgets/:id", createBudget);
budgetRouter.get("/userbudgets/:id", getBudgetsByUser);
budgetRouter.delete("/deletebudget/:id", deleteBudgetById);

export default budgetRouter;
