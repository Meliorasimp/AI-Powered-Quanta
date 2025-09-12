import express from "express";
import { createTransaction } from "../controllers/transactioncontroller";
import { getUserTransactionsById } from "../controllers/transactioncontroller";

const TransactionRouter = express.Router();

TransactionRouter.post("/create/transaction/:id", createTransaction);
TransactionRouter.get("/get/transactions/:id", getUserTransactionsById);

export default TransactionRouter;
