import { Schema, model, Document } from "mongoose";

interface IGoal extends Document {
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  priority: string;
  frequency: string;
  notes: string;
  userId: string;
}

const goalSchema = new Schema<IGoal>({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, required: true },
  deadline: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  frequency: { type: String, required: true },
  notes: { type: String, required: true },
  userId: { type: String, required: true },
});

const Goal = model<IGoal>("Goal", goalSchema);

export default Goal;
