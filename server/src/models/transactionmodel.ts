import { Document, Schema, model } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  transactionName: string;
  amount: number;
  merchant: string;
  type: "income" | "expense" | "transfer";
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
  status: { type: String, enum: ["pending", "cleared"], required: true },
  dateCreated: { type: Date, default: Date.now },
});

const TransactionModel = model<ITransaction>("Transaction", transactionSchema);

export default TransactionModel;
