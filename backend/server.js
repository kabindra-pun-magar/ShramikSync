import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { prisma } from "./lib/prisma.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import employerRoutes from "./routes/employerRoutes.js";
import demandLetterRoutes from "./routes/demandLetterRoutes.js";
import documentRoutes from "./routes/documents.js";

import { authenticateToken } from "./middleware/authMiddleware.js";
import { authorizeRoles } from "./middleware/roleMiddleware.js";

// ========================================
// ES MODULE PATH SETUP
// ========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// APP
// ========================================

const app = express();

const PORT = 5000;

// ========================================
// STATIC UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ========================================
// DOCUMENT ROUTES
// ========================================

app.use("/api/documents", documentRoutes);

// ========================================
// AUTHENTICATION ROUTES
// ========================================

app.use("/api/auth", authRoutes);

// ========================================
// DASHBOARD ROUTES
// ========================================

app.use("/api/dashboard", dashboardRoutes);

// ========================================
// CANDIDATE ROUTES
// ========================================

app.use("/api/candidates", candidateRoutes);

// ========================================
// EMPLOYER ROUTES
// ========================================

app.use("/api/employers", employerRoutes);

// ========================================
// DEMAND LETTER ROUTES
// ========================================

app.use(
  "/api/demand-letters",
  demandLetterRoutes
);

// ========================================
// BASIC BACKEND TEST
// ========================================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend connected to backend successfully!",
  });
});

// ========================================
// DATABASE HEALTH TEST
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
// JWT PROTECTED TEST ROUTE
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
// ADMIN PROTECTED TEST ROUTE
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
// START SERVER
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

  console.log(
    `Documents API: http://localhost:${PORT}/api/documents`
  );
});