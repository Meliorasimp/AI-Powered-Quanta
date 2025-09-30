import { Document, Schema, model } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  transactionName: string;
  amount: number;
  merchant: string;
  type: "income" | "expense" | "transfer";
  expenseCategory?:
    | "Housing"
    | "Utilities"
    | "Groceries"
    | "Entertainment"
    | "Transportation"
    | "Education";
  status: "pending" | "cleared";
  dateCreated: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  transactionName: { type: String, required: true },
  amount: { type: Number, required: true },
  merchant: { type: String, required: true },
  type: {
    type: String,
    enum: ["income", "expense", "transfer"],
    required: true,
  },
  expenseCategory: {
    type: String,
    enum: [
      "Housing",
      "Utilities",
      "Groceries",
      "Entertainment",
      "Transportation",
      "Education",
    ],
    required: function () {
      return this.type === "expense";
    },
  },
  status: { type: String, enum: ["pending", "cleared"], required: true },
  dateCreated: { type: Date, default: Date.now },
});

const TransactionModel = model<ITransaction>("Transaction", transactionSchema);

export default TransactionModel;
