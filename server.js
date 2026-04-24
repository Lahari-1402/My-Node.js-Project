const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

console.log("ENV LOADED"); // 👈 DEBUG

// Connect Database
connectDB();

const app = express();

app.use(express.json());

// Test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/brands", require("./routes/brandRoutes"));

// Use PORT from .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});