import express from "express";
import cors from "cors";

import { prisma } from "./lib/prisma.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import employerRoutes from "./routes/employerRoutes.js";

import { authenticateToken } from "./middleware/authMiddleware.js";
import { authorizeRoles } from "./middleware/roleMiddleware.js";

const app = express();

const PORT = 5000;

// ========================================
// Middleware
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ========================================
// Authentication Routes
// ========================================

app.use("/api/auth", authRoutes);

// ========================================
// Dashboard Routes
// ========================================

app.use("/api/dashboard", dashboardRoutes);

// ========================================
// Basic Backend Test
// ========================================

app.use("/api/candidates", candidateRoutes);


app.use("/api/employers", employerRoutes);

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend connected to backend successfully!",
  });
});

// ========================================
// Database Health Test
// ========================================

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

// ========================================
// JWT Protected Test Route
// ========================================

app.get(
  "/api/auth/protected",
  authenticateToken,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "You have access to this protected route.",
      user: req.user,
    });
  }
);

// ========================================
// ADMIN Protected Test Route
// ========================================

app.get(
  "/api/admin/test",
  authenticateToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin. You have access to this route.",
      user: req.user,
    });
  }
);

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);

  console.log(
    `Backend test: http://localhost:${PORT}/api/test`
  );

  console.log(
    `Database test: http://localhost:${PORT}/api/health/db`
  );

  console.log(
    `Protected test: http://localhost:${PORT}/api/auth/protected`
  );

  console.log(
    `Admin test: http://localhost:${PORT}/api/admin/test`
  );

  console.log(
    `Dashboard API: http://localhost:${PORT}/api/dashboard`
  );
});