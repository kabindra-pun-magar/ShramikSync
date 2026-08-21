import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * Protected Dashboard API
 * GET /api/dashboard
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    // User ID comes from JWT middleware
    const userId = req.user.userId;

    // ========================================
    // GET CURRENT USER
    // ========================================

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ========================================
    // DASHBOARD STATISTICS
    // ========================================

    // Total users in the system
    const totalUsers = await prisma.user.count();

    // Total candidates created by current user
    const totalCandidates =
      await prisma.candidate.count({
        where: {
          createdById: userId,
        },
      });

    // Registered candidates created by current user
    const registeredCandidates =
      await prisma.candidate.count({
        where: {
          createdById: userId,
          status: "REGISTERED",
        },
      });

    // Total employers created by current user
    const totalEmployers =
      await prisma.employer.count({
        where: {
          createdById: userId,
        },
      });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Dashboard data retrieved successfully.",

      user,

      stats: {
        totalUsers,
        totalCandidates,
        registeredCandidates,
        totalEmployers,
      },
    });

  } catch (error) {
    console.error(
      "Dashboard API error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard data.",
    });
  }
});

export default router;