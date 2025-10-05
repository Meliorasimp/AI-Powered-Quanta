import express from "express";
import {
  postGoalData,
  getGoalData,
  allocateAmountToGoal,
} from "../controllers/goalcontroller";
const goalRouter = express.Router();

goalRouter.post("/post/:id", postGoalData);
goalRouter.get("/get/:id", getGoalData);
goalRouter.put("/allocate/:id", allocateAmountToGoal);

export default goalRouter;
