import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// GET REPORT SUMMARY
// ========================================

router.get("/summary", authenticateToken, async (req, res) => {
  try {
    // ========================================
    // CANDIDATE STATISTICS
    // ========================================

    const totalCandidates = await prisma.candidate.count();

    const candidateStatusCounts = await prisma.candidate.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    // ========================================
    // EMPLOYER STATISTICS
    // ========================================

    const totalEmployers = await prisma.employer.count();

    const employerStatusCounts = await prisma.employer.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    // ========================================
    // DEMAND LETTER STATISTICS
    // ========================================

    const totalDemandLetters = await prisma.demandLetter.count();

    const demandLetterStatusCounts =
      await prisma.demandLetter.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      });

    // ========================================
    // DOCUMENT STATISTICS
    // ========================================

    const totalDocuments = await prisma.document.count();

    const documentTypeCounts = await prisma.document.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
    });

    // ========================================
    // WORKER / ASSIGNMENT STATISTICS
    // ========================================

    const demandWorkerResult =
      await prisma.demandLetter.aggregate({
        _sum: {
          numberOfWorkers: true,
        },
      });

    const totalWorkersRequired =
      demandWorkerResult._sum.numberOfWorkers || 0;

    const totalWorkersAssigned =
      await prisma.demandLetterCandidate.count();

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,

      candidates: {
        total: totalCandidates,

        byStatus: candidateStatusCounts.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },

      employers: {
        total: totalEmployers,

        byStatus: employerStatusCounts.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },

      demandLetters: {
        total: totalDemandLetters,

        byStatus: demandLetterStatusCounts.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
      },

      documents: {
        total: totalDocuments,

        byType: documentTypeCounts.map((item) => ({
          type: item.type,
          count: item._count.type,
        })),
      },

      assignments: {
        totalWorkersRequired,
        totalWorkersAssigned,
        remainingWorkers:
          Math.max(
            totalWorkersRequired - totalWorkersAssigned,
            0
          ),
      },
    });
  } catch (error) {
    console.error("Reports summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate report summary.",
      error: error.message,
    });
  }
});

export default router;