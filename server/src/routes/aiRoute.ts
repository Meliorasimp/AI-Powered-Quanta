import express from "express";
import { summarizeTransactions } from "../controllers/aicontroller";

const AiRouter = express.Router();

AiRouter.get("/summarize/:id", summarizeTransactions);

export default AiRouter;
