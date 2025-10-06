import express from "express";
import {
  postGoalData,
  getGoalData,
  updateGoal,
  deleteGoal,
  allocateAmountToGoal,
} from "../controllers/goalcontroller";
const goalRouter = express.Router();

goalRouter.post("/post/:id", postGoalData);
goalRouter.get("/get/:id", getGoalData);
goalRouter.put("/allocate/:id", allocateAmountToGoal);
goalRouter.put("/updat/:id", updateGoal);
goalRouter.delete("/delete/:id", deleteGoal);

export default goalRouter;
