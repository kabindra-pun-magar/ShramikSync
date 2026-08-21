import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// CREATE CANDIDATE
// POST /api/candidates
// ========================================

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      nationality,
      address,
      passportNumber,
      passportExpiry,
      education,
      experience,
      skills,
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        fullName: fullName.trim(),

        email: email?.trim() || null,

        phone: phone?.trim() || null,

        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : null,

        gender: gender?.trim() || null,

        nationality: nationality?.trim() || null,

        address: address?.trim() || null,

        passportNumber: passportNumber?.trim() || null,

        passportExpiry: passportExpiry
          ? new Date(passportExpiry)
          : null,

        education: education?.trim() || null,

        experience: experience?.trim() || null,

        skills: skills?.trim() || null,

        // Candidate belongs to logged-in user
        createdById: req.user.userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully.",
      candidate,
    });
  } catch (error) {
    console.error("Create candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create candidate.",
    });
  }
});


// ========================================
// GET ALL CANDIDATES
// GET /api/candidates
// ========================================

// ========================================
// GET ALL CANDIDATES
// GET /api/candidates
//
// Optional query parameters:
//
// ?search=ram
// ?status=SCREENING
// ?search=ram&status=SCREENING
// ========================================

router.get("/", authenticateToken, async (req, res) => {
  try {
    // ========================================
    // READ QUERY PARAMETERS
    // ========================================

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim()
        : "";


    // ========================================
    // BUILD FILTER
    // ========================================

    const where = {
      // Ownership protection
      createdById: req.user.userId,

      // Add search only when provided
      ...(search && {
        OR: [
          {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            passportNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      // Add status filter only when provided
      ...(status && {
        status,
      }),
    };


    // ========================================
    // FETCH FILTERED CANDIDATES
    // ========================================

    const candidates =
      await prisma.candidate.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },
      });


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });

  } catch (error) {

    console.error(
      "Get candidates error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates.",
    });
  }
});


// ========================================
// GET SINGLE CANDIDATE
// GET /api/candidates/:id
// ========================================

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const candidateId = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(candidateId) || candidateId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,

        // Ownership protection
        createdById: req.user.userId,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Get candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate.",
    });
  }
});


// ========================================
// UPDATE CANDIDATE
// PUT /api/candidates/:id
// ========================================

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const candidateId = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(candidateId) || candidateId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      nationality,
      address,
      passportNumber,
      passportExpiry,
      education,
      experience,
      skills,
      status,
    } = req.body;

    // ========================================
    // Check ownership
    // ========================================

    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        createdById: req.user.userId,
      },
    });

    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    // ========================================
    // Validate full name
    // ========================================

    if (fullName !== undefined && !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name cannot be empty.",
      });
    }

    // ========================================
    // Update candidate
    // ========================================

    const candidate = await prisma.candidate.update({
      where: {
        id: candidateId,
      },

      data: {
        ...(fullName !== undefined && {
          fullName: fullName.trim(),
        }),

        ...(email !== undefined && {
          email: email?.trim() || null,
        }),

        ...(phone !== undefined && {
          phone: phone?.trim() || null,
        }),

        ...(dateOfBirth !== undefined && {
          dateOfBirth: dateOfBirth
            ? new Date(dateOfBirth)
            : null,
        }),

        ...(gender !== undefined && {
          gender: gender?.trim() || null,
        }),

        ...(nationality !== undefined && {
          nationality: nationality?.trim() || null,
        }),

        ...(address !== undefined && {
          address: address?.trim() || null,
        }),

        ...(passportNumber !== undefined && {
          passportNumber:
            passportNumber?.trim() || null,
        }),

        ...(passportExpiry !== undefined && {
          passportExpiry: passportExpiry
            ? new Date(passportExpiry)
            : null,
        }),

        ...(education !== undefined && {
          education: education?.trim() || null,
        }),

        ...(experience !== undefined && {
          experience: experience?.trim() || null,
        }),

        ...(skills !== undefined && {
          skills: skills?.trim() || null,
        }),

        ...(status !== undefined && {
          status,
        }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully.",
      candidate,
    });
  } catch (error) {
    console.error("Update candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update candidate.",
    });
  }
});


// ========================================
// DELETE CANDIDATE
// DELETE /api/candidates/:id
// ========================================

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const candidateId = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(candidateId) || candidateId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID.",
      });
    }

    // ========================================
    // Check ownership
    // ========================================

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        createdById: req.user.userId,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    // ========================================
    // Delete candidate
    // ========================================

    await prisma.candidate.delete({
      where: {
        id: candidateId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully.",
    });
  } catch (error) {
    console.error("Delete candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate.",
    });
  }
});


export default router;