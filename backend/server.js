import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

const app = express();

const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Basic backend test
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend connected to backend successfully!",
  });
});

// Database health test
app.get("/api/health/db", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      success: true,
      database: "connected",
      users: userCount,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      database: "disconnected",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Database api test http://localhost:5000/api/test');
  console.log('http://localhost:5000/api/health/db');
});