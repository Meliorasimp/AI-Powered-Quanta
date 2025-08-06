import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
// Importing necessary modules

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI as string;

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server`);
});
