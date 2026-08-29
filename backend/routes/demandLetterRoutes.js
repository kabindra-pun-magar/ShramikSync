import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// CREATE DEMAND LETTER
// POST /api/demand-letters
// ========================================

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      referenceNumber,
      jobTitle,
      numberOfWorkers,
      salary,
      contractDuration,
      country,
      city,
      description,
      status,
      issueDate,
      expiryDate,
    } = req.body;

    const userId = req.user.userId;

    // ========================================
    // VALIDATION
    // ========================================

    if (!referenceNumber || !referenceNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reference number is required.",
      });
    }

    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required.",
      });
    }

    if (
      numberOfWorkers === undefined ||
      numberOfWorkers === null ||
      Number(numberOfWorkers) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Number of workers must be greater than 0.",
      });
    }

    if (!country || !country.trim()) {
      return res.status(400).json({
        success: false,
        message: "Country is required.",
      });
    }

    // ========================================
    // CHECK DUPLICATE REFERENCE NUMBER
    // ========================================

    const existingDemandLetter =
      await prisma.demandLetter.findUnique({
        where: {
          referenceNumber: referenceNumber.trim(),
        },
      });

    if (existingDemandLetter) {
      return res.status(409).json({
        success: false,
        message: "Reference number already exists.",
      });
    }

    // ========================================
    // CREATE DEMAND LETTER
    // ========================================

    const demandLetter =
      await prisma.demandLetter.create({
        data: {
          referenceNumber: referenceNumber.trim(),

          jobTitle: jobTitle.trim(),

          numberOfWorkers: Number(numberOfWorkers),

          salary: salary?.trim() || null,

          contractDuration:
            contractDuration?.trim() || null,

          country: country.trim(),

          city: city?.trim() || null,

          description:
            description?.trim() || null,

          status: status || "DRAFT",

          issueDate: issueDate
            ? new Date(issueDate)
            : null,

          expiryDate: expiryDate
            ? new Date(expiryDate)
            : null,

          createdById: userId,
        },
      });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,
      message: "Demand letter created successfully.",
      demandLetter,
    });

  } catch (error) {
    console.error(
      "Create demand letter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create demand letter.",
      error: error.message,
    });
  }
});

// ========================================
// GET ALL DEMAND LETTERS
// GET /api/demand-letters
// ========================================

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const demandLetters =
      await prisma.demandLetter.findMany({
        where: {
          createdById: userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      count: demandLetters.length,
      demandLetters,
    });

  } catch (error) {
    console.error(
      "Get demand letters error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch demand letters.",
      error: error.message,
    });
  }
});

// ========================================
// GET SINGLE DEMAND LETTER
// GET /api/demand-letters/:id
// ========================================

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const demandLetterId = Number(req.params.id);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (!Number.isInteger(demandLetterId) || demandLetterId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid demand letter ID.",
      });
    }

    // ========================================
    // FIND DEMAND LETTER
    // ========================================

    const demandLetter =
      await prisma.demandLetter.findFirst({
        where: {
          id: demandLetterId,
          createdById: userId,
        },
      });

    // ========================================
    // NOT FOUND
    // ========================================

    if (!demandLetter) {
      return res.status(404).json({
        success: false,
        message: "Demand letter not found.",
      });
    }

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      demandLetter,
    });

  } catch (error) {
    console.error(
      "Get single demand letter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch demand letter.",
      error: error.message,
    });
  }
});

// ========================================
// UPDATE DEMAND LETTER
// PUT /api/demand-letters/:id
// ========================================

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const demandLetterId = Number(req.params.id);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (!Number.isInteger(demandLetterId) || demandLetterId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid demand letter ID.",
      });
    }

    // ========================================
    // GET REQUEST BODY
    // ========================================

    const {
      referenceNumber,
      jobTitle,
      numberOfWorkers,
      salary,
      contractDuration,
      country,
      city,
      description,
      status,
      issueDate,
      expiryDate,
    } = req.body;

    // ========================================
    // CHECK OWNERSHIP
    // ========================================

    const existingDemandLetter =
      await prisma.demandLetter.findFirst({
        where: {
          id: demandLetterId,
          createdById: userId,
        },
      });

    if (!existingDemandLetter) {
      return res.status(404).json({
        success: false,
        message: "Demand letter not found.",
      });
    }

    // ========================================
    // VALIDATION
    // ========================================

    if (referenceNumber !== undefined) {
      if (
        typeof referenceNumber !== "string" ||
        !referenceNumber.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Reference number cannot be empty.",
        });
      }
    }

    if (jobTitle !== undefined) {
      if (
        typeof jobTitle !== "string" ||
        !jobTitle.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Job title cannot be empty.",
        });
      }
    }

    if (numberOfWorkers !== undefined) {
      if (
        Number.isNaN(Number(numberOfWorkers)) ||
        Number(numberOfWorkers) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Number of workers must be greater than 0.",
        });
      }
    }

    if (country !== undefined) {
      if (
        typeof country !== "string" ||
        !country.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Country cannot be empty.",
        });
      }
    }

    // ========================================
    // VALIDATE STATUS
    // ========================================

    const validStatuses = [
      "DRAFT",
      "ACTIVE",
      "EXPIRED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid demand letter status.",
      });
    }

    // ========================================
    // CHECK DUPLICATE REFERENCE NUMBER
    // ========================================

    if (
      referenceNumber !== undefined &&
      referenceNumber.trim() !==
        existingDemandLetter.referenceNumber
    ) {
      const duplicateReference =
        await prisma.demandLetter.findUnique({
          where: {
            referenceNumber: referenceNumber.trim(),
          },
        });

      if (duplicateReference) {
        return res.status(409).json({
          success: false,
          message: "Reference number already exists.",
        });
      }
    }

    // ========================================
    // PREPARE UPDATE DATA
    // ========================================

    const updateData = {};

    if (referenceNumber !== undefined) {
      updateData.referenceNumber =
        referenceNumber.trim();
    }

    if (jobTitle !== undefined) {
      updateData.jobTitle = jobTitle.trim();
    }

    if (numberOfWorkers !== undefined) {
      updateData.numberOfWorkers =
        Number(numberOfWorkers);
    }

    if (salary !== undefined) {
      updateData.salary =
        salary?.trim() || null;
    }

    if (contractDuration !== undefined) {
      updateData.contractDuration =
        contractDuration?.trim() || null;
    }

    if (country !== undefined) {
      updateData.country = country.trim();
    }

    if (city !== undefined) {
      updateData.city =
        city?.trim() || null;
    }

    if (description !== undefined) {
      updateData.description =
        description?.trim() || null;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (issueDate !== undefined) {
      updateData.issueDate =
        issueDate ? new Date(issueDate) : null;
    }

    if (expiryDate !== undefined) {
      updateData.expiryDate =
        expiryDate ? new Date(expiryDate) : null;
    }

    // ========================================
    // UPDATE DEMAND LETTER
    // ========================================

    const updatedDemandLetter =
      await prisma.demandLetter.update({
        where: {
          id: demandLetterId,
        },
        data: updateData,
      });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Demand letter updated successfully.",
      demandLetter: updatedDemandLetter,
    });

  } catch (error) {
    console.error(
      "Update demand letter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update demand letter.",
      error: error.message,
    });
  }
});

// ========================================
// DELETE DEMAND LETTER
// DELETE /api/demand-letters/:id
// ========================================

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const demandLetterId = Number(req.params.id);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (
      !Number.isInteger(demandLetterId) ||
      demandLetterId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid demand letter ID.",
      });
    }

    // ========================================
    // CHECK OWNERSHIP
    // ========================================

    const existingDemandLetter =
      await prisma.demandLetter.findFirst({
        where: {
          id: demandLetterId,
          createdById: userId,
        },
      });

    if (!existingDemandLetter) {
      return res.status(404).json({
        success: false,
        message: "Demand letter not found.",
      });
    }

    // ========================================
    // DELETE DEMAND LETTER
    // ========================================

    await prisma.demandLetter.delete({
      where: {
        id: demandLetterId,
      },
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Demand letter deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete demand letter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete demand letter.",
      error: error.message,
    });
  }
});

// ========================================
// GET SINGLE DEMAND LETTER
// GET /api/demand-letters/:id
// ========================================

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const demandLetterId = Number(req.params.id);
    const userId = req.user.userId;

    // ========================================
    // VALIDATE ID
    // ========================================

    if (!Number.isInteger(demandLetterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid demand letter ID.",
      });
    }

    // ========================================
    // FIND DEMAND LETTER
    // ========================================

    const demandLetter =
      await prisma.demandLetter.findFirst({
        where: {
          id: demandLetterId,
          createdById: userId,
        },
      });

    // ========================================
    // NOT FOUND / NOT OWNED
    // ========================================

    if (!demandLetter) {
      return res.status(404).json({
        success: false,
        message: "Demand letter not found.",
      });
    }

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      demandLetter,
    });

  } catch (error) {
    console.error(
      "Get single demand letter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch demand letter.",
      error: error.message,
    });
  }
});


export default router;