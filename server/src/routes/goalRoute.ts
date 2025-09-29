import express from "express";
import { postGoalData, getGoalData } from "../controllers/goalcontroller";
const goalRouter = express.Router();

goalRouter.post("/post/:id", postGoalData);
goalRouter.get("/get/:id", getGoalData);

export default goalRouter;
