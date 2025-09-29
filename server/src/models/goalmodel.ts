import { Schema, model, Document } from "mongoose";

interface IGoal extends Document {
  name: string;
  target: string;
  current: string;
  deadline: string;
  category: string;
  priority: string;
  frequency: string;
  notes: string;
  userId: string;
}

const goalSchema = new Schema<IGoal>({
  name: { type: String, required: true },
  target: { type: String, required: true },
  current: { type: String, required: true },
  deadline: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  frequency: { type: String, required: true },
  notes: { type: String, required: true },
  userId: { type: String, required: true },
});

const Goal = model<IGoal>("Goal", goalSchema);

export default Goal;
