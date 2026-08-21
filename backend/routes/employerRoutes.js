import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// CREATE EMPLOYER
// POST /api/employers
// ========================================

router.post("/", authenticateToken, async (req, res) => {
  try {

    const {
      companyName,
      contactPerson,
      email,
      phone,
      country,
      city,
      address,
      industry,
      companyType,
      status,
    } = req.body;


    // ========================================
    // VALIDATE COMPANY NAME
    // ========================================

    if (!companyName || !companyName.trim()) {

      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });

    }


    // ========================================
    // CREATE EMPLOYER
    // ========================================

    const employer =
      await prisma.employer.create({

        data: {

          companyName:
            companyName.trim(),

          contactPerson:
            contactPerson?.trim() || null,

          email:
            email?.trim() || null,

          phone:
            phone?.trim() || null,

          country:
            country?.trim() || null,

          city:
            city?.trim() || null,

          address:
            address?.trim() || null,

          industry:
            industry?.trim() || null,

          companyType:
            companyType?.trim() || null,

          status:
            status || "PENDING",

          createdById:
            req.user.userId,
        },

      });


    // ========================================
    // SUCCESS
    // ========================================

    return res.status(201).json({

      success: true,

      message:
        "Employer created successfully.",

      employer,

    });


  } catch (error) {

    console.error(
      "Create employer error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to create employer.",

      error:
        error.message,

    });

  }

});

// ========================================
// GET ALL EMPLOYERS
// GET /api/employers
// ========================================

router.get("/", authenticateToken, async (req, res) => {
  try {

    const employers =
      await prisma.employer.findMany({
        where: {
          createdById: req.user.userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });


    return res.status(200).json({

      success: true,

      count: employers.length,

      employers,

    });


  } catch (error) {

    console.error(
      "Get employers error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch employers.",

    });

  }
});

// ========================================
// GET SINGLE EMPLOYER
// GET /api/employers/:id
// ========================================

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const employerId = Number(req.params.id);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (
      !Number.isInteger(employerId) ||
      employerId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid employer ID.",
      });
    }


    // ========================================
    // FIND EMPLOYER
    // ========================================

    const employer =
      await prisma.employer.findFirst({
        where: {
          id: employerId,

          // Ownership protection
          createdById: req.user.userId,
        },
      });


    // ========================================
    // NOT FOUND
    // ========================================

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }


    // ========================================
    // SUCCESS
    // ========================================

    return res.status(200).json({
      success: true,
      employer,
    });


  } catch (error) {

    console.error(
      "Get employer error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Failed to fetch employer.",
    });

  }
});

// ========================================
// UPDATE EMPLOYER
// PUT /api/employers/:id
// ========================================

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const employerId = Number(req.params.id);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (
      !Number.isInteger(employerId) ||
      employerId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid employer ID.",
      });
    }


    // ========================================
    // GET REQUEST DATA
    // ========================================

    const {
      companyName,
      contactPerson,
      email,
      phone,
      country,
      city,
      address,
      industry,
      companyType,
      status,
    } = req.body;


    // ========================================
    // CHECK OWNERSHIP
    // ========================================

    const existingEmployer =
      await prisma.employer.findFirst({
        where: {
          id: employerId,
          createdById: req.user.userId,
        },
      });


    if (!existingEmployer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }


    // ========================================
    // VALIDATE COMPANY NAME
    // ========================================

    if (
      companyName !== undefined &&
      !companyName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot be empty.",
      });
    }


    // ========================================
    // UPDATE EMPLOYER
    // ========================================

    const employer =
      await prisma.employer.update({

        where: {
          id: employerId,
        },

        data: {

          ...(companyName !== undefined && {
            companyName:
              companyName.trim(),
          }),

          ...(contactPerson !== undefined && {
            contactPerson:
              contactPerson?.trim() || null,
          }),

          ...(email !== undefined && {
            email:
              email?.trim() || null,
          }),

          ...(phone !== undefined && {
            phone:
              phone?.trim() || null,
          }),

          ...(country !== undefined && {
            country:
              country?.trim() || null,
          }),

          ...(city !== undefined && {
            city:
              city?.trim() || null,
          }),

          ...(address !== undefined && {
            address:
              address?.trim() || null,
          }),

          ...(industry !== undefined && {
            industry:
              industry?.trim() || null,
          }),

          ...(companyType !== undefined && {
            companyType:
              companyType?.trim() || null,
          }),

          ...(status !== undefined && {
            status,
          }),

        },

      });


    // ========================================
    // SUCCESS
    // ========================================

    return res.status(200).json({

      success: true,

      message:
        "Employer updated successfully.",

      employer,

    });


  } catch (error) {

    console.error(
      "Update employer error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update employer.",

    });

  }
});

// ========================================
// DELETE EMPLOYER
// DELETE /api/employers/:id
// ========================================

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const employerId = Number(req.params.id);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (
      !Number.isInteger(employerId) ||
      employerId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid employer ID.",
      });
    }


    // ========================================
    // CHECK OWNERSHIP
    // ========================================

    const existingEmployer =
      await prisma.employer.findFirst({
        where: {
          id: employerId,
          createdById: req.user.userId,
        },
      });


    if (!existingEmployer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }


    // ========================================
    // DELETE EMPLOYER
    // ========================================

    await prisma.employer.delete({
      where: {
        id: employerId,
      },
    });


    // ========================================
    // SUCCESS
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Employer deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete employer error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Failed to delete employer.",
    });

  }
});


export default router;