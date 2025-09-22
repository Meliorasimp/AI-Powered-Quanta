import express from "express";
import { summarizeTransactions } from "../controllers/hfcontroller";

const HFRouter = express.Router();

HFRouter.get("/summarize/:id", summarizeTransactions);

export default HFRouter;
