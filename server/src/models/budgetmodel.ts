import { Schema, model, Document } from "mongoose";

export interface IBudget extends Document {
  description: string;
  amount: number;
  category: string;
  dateCreated: Date;
  userId: string;
}

const budgetSchema = new Schema<IBudget>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  userId: { type: String, required: true, ref: "User" },
});

export const Budget = model<IBudget>("Budget", budgetSchema);
export default Budget;
