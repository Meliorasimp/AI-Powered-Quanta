import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userroute";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI as string;

app.use("/api", userRouter);
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server`);
});
