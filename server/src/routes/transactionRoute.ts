import express from "express";
import {
  createTransaction,
  getUserTransactionsById,
  getTransactionsByType,
  getTransactionsByStatus,
} from "../controllers/transactioncontroller";

const TransactionRouter = express.Router();

TransactionRouter.post("/create/transaction/:id", createTransaction);
TransactionRouter.get("/get/transactions/:id", getUserTransactionsById);
TransactionRouter.get("/get/:type/:id", getTransactionsByType);
TransactionRouter.get("/get/status/:status/:id", getTransactionsByStatus);

export default TransactionRouter;
