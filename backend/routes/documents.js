import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// ES MODULE PATH SETUP
// ========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// UPLOAD DIRECTORY
// ========================================

const uploadDirectory = path.join(
  __dirname,
  "../uploads/documents"
);

// Create directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ========================================
// ALLOWED FILE TYPES
// ========================================

const allowedMimeTypes = [
  "application/pdf",

  "image/jpeg",
  "image/png",
  "image/jpg",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. PDF, JPG, PNG, DOC, DOCX, XLS and XLSX files are allowed."
      ),
      false
    );
  }
};

// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// ========================================
// DOCUMENT TYPES
// ========================================

const allowedDocumentTypes = [
  "PASSPORT",
  "CITIZENSHIP",
  "EDUCATION_CERTIFICATE",
  "EXPERIENCE_LETTER",
  "MEDICAL_REPORT",
  "POLICE_CLEARANCE",
  "CONTRACT",
  "VISA",
  "OTHER",
];

// ========================================
// GET ALL DOCUMENTS
// GET /api/documents
// ========================================

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId;

      const documents = await prisma.document.findMany({
        where: {
          candidate: {
            createdById: userId,
          },
        },

        include: {
          candidate: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        count: documents.length,
        documents,
      });
    } catch (error) {
      console.error(
        "Get documents error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch documents.",
        error: error.message,
      });
    }
  }
);

// ========================================
// GET DOCUMENTS FOR CANDIDATE
// GET /api/documents/candidate/:candidateId
// ========================================

router.get(
  "/candidate/:candidateId",
  authenticateToken,
  async (req, res) => {
    try {
      const candidateId = Number(
        req.params.candidateId
      );

      const userId = req.user.userId;

      // ========================================
      // VALIDATE CANDIDATE ID
      // ========================================

      if (
        !Number.isInteger(candidateId) ||
        candidateId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid candidate ID.",
        });
      }

      // ========================================
      // CHECK CANDIDATE OWNERSHIP
      // ========================================

      const candidate =
        await prisma.candidate.findFirst({
          where: {
            id: candidateId,
            createdById: userId,
          },
        });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found.",
        });
      }

      // ========================================
      // GET DOCUMENTS
      // ========================================

      const documents =
        await prisma.document.findMany({
          where: {
            candidateId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      return res.status(200).json({
        success: true,
        count: documents.length,
        documents,
      });
    } catch (error) {
      console.error(
        "Get candidate documents error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch candidate documents.",
        error: error.message,
      });
    }
  }
);

// ========================================
// GET SINGLE DOCUMENT
// GET /api/documents/:id
// ========================================

router.get(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const documentId = Number(
        req.params.id
      );

      const userId = req.user.userId;

      // ========================================
      // VALIDATE DOCUMENT ID
      // ========================================

      if (
        !Number.isInteger(documentId) ||
        documentId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid document ID.",
        });
      }

      // ========================================
      // FIND DOCUMENT + OWNERSHIP
      // ========================================

      const document =
        await prisma.document.findFirst({
          where: {
            id: documentId,

            candidate: {
              createdById: userId,
            },
          },

          include: {
            candidate: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        });

      // ========================================
      // NOT FOUND
      // ========================================

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      return res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      console.error(
        "Get single document error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch document.",
        error: error.message,
      });
    }
  }
);

// ========================================
// UPLOAD DOCUMENT
// POST /api/documents
//
// Form-data:
// name
// type
// candidateId
// description
// file
// ========================================

router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const userId = req.user.userId;

      // ========================================
      // GET FORM DATA
      // ========================================

      const {
        name,
        type,
        candidateId,
        description,
      } = req.body;

      // ========================================
      // VALIDATE FILE
      // ========================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document file is required.",
        });
      }

      // ========================================
      // VALIDATE CANDIDATE ID
      // ========================================

      const parsedCandidateId =
        Number(candidateId);

      if (
        !Number.isInteger(parsedCandidateId) ||
        parsedCandidateId <= 0
      ) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid candidate ID.",
        });
      }

      // ========================================
      // VALIDATE DOCUMENT NAME
      // ========================================

      if (!name || !name.trim()) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Document name is required.",
        });
      }

      // ========================================
      // VALIDATE DOCUMENT TYPE
      // ========================================

      const documentType = type || "OTHER";

      if (
        !allowedDocumentTypes.includes(
          documentType
        )
      ) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid document type.",
        });
      }

      // ========================================
      // CHECK CANDIDATE OWNERSHIP
      // ========================================

      const candidate =
        await prisma.candidate.findFirst({
          where: {
            id: parsedCandidateId,
            createdById: userId,
          },
        });

      if (!candidate) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          success: false,
          message:
            "Candidate not found or you do not have permission to access this candidate.",
        });
      }

      // ========================================
      // FILE URL
      // ========================================

      const fileUrl =
        `/uploads/documents/${req.file.filename}`;

      // ========================================
      // CREATE DATABASE RECORD
      // ========================================

      const document =
        await prisma.document.create({
          data: {
            name: name.trim(),

            type: documentType,

            fileUrl,

            fileName: req.file.originalname,

            mimeType: req.file.mimetype,

            fileSize: req.file.size,

            description:
              description?.trim() || null,

            candidateId:
              parsedCandidateId,
          },

          include: {
            candidate: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        });

      // ========================================
      // SUCCESS RESPONSE
      // ========================================

      return res.status(201).json({
        success: true,
        message:
          "Document uploaded successfully.",
        document,
      });
    } catch (error) {
      console.error(
        "Upload document error:",
        error
      );

      // ========================================
      // DELETE FILE IF DATABASE OPERATION FAILED
      // ========================================

      if (
        req.file &&
        req.file.path &&
        fs.existsSync(req.file.path)
      ) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (deleteError) {
          console.error(
            "Failed to delete uploaded file:",
            deleteError
          );
        }
      }

      return res.status(500).json({
        success: false,
        message: "Failed to upload document.",
        error: error.message,
      });
    }
  }
);

// ========================================
// UPLOAD DOCUMENT FOR SPECIFIC CANDIDATE
// POST /api/documents/candidate/:candidateId
//
// This route is also supported.
// ========================================

router.post(
  "/candidate/:candidateId",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const candidateId = Number(
        req.params.candidateId
      );

      const userId = req.user.userId;

      // ========================================
      // VALIDATE CANDIDATE ID
      // ========================================

      if (
        !Number.isInteger(candidateId) ||
        candidateId <= 0
      ) {
        if (
          req.file?.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid candidate ID.",
        });
      }

      // ========================================
      // CHECK FILE
      // ========================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document file is required.",
        });
      }

      // ========================================
      // GET FORM DATA
      // ========================================

      const {
        name,
        type,
        description,
      } = req.body;

      // ========================================
      // VALIDATE NAME
      // ========================================

      if (!name || !name.trim()) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Document name is required.",
        });
      }

      // ========================================
      // VALIDATE TYPE
      // ========================================

      const documentType = type || "OTHER";

      if (
        !allowedDocumentTypes.includes(
          documentType
        )
      ) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Invalid document type.",
        });
      }

      // ========================================
      // CHECK CANDIDATE OWNERSHIP
      // ========================================

      const candidate =
        await prisma.candidate.findFirst({
          where: {
            id: candidateId,
            createdById: userId,
          },
        });

      if (!candidate) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          success: false,
          message: "Candidate not found.",
        });
      }

      // ========================================
      // FILE URL
      // ========================================

      const fileUrl =
        `/uploads/documents/${req.file.filename}`;

      // ========================================
      // CREATE DOCUMENT
      // ========================================

      const document =
        await prisma.document.create({
          data: {
            name: name.trim(),

            type: documentType,

            fileUrl,

            fileName: req.file.originalname,

            mimeType: req.file.mimetype,

            fileSize: req.file.size,

            description:
              description?.trim() || null,

            candidateId,
          },

          include: {
            candidate: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        });

      // ========================================
      // SUCCESS
      // ========================================

      return res.status(201).json({
        success: true,
        message:
          "Document uploaded successfully.",
        document,
      });
    } catch (error) {
      console.error(
        "Candidate document upload error:",
        error
      );

      if (
        req.file &&
        req.file.path &&
        fs.existsSync(req.file.path)
      ) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (deleteError) {
          console.error(
            "Failed to delete uploaded file:",
            deleteError
          );
        }
      }

      return res.status(500).json({
        success: false,
        message: "Failed to upload document.",
        error: error.message,
      });
    }
  }
);

// ========================================
// UPDATE DOCUMENT
// PUT /api/documents/:id
// ========================================

router.put(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const documentId = Number(
        req.params.id
      );

      const userId = req.user.userId;

      const {
        name,
        type,
        description,
      } = req.body;

      // ========================================
      // VALIDATE ID
      // ========================================

      if (
        !Number.isInteger(documentId) ||
        documentId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid document ID.",
        });
      }

      // ========================================
      // FIND DOCUMENT + OWNERSHIP
      // ========================================

      const existingDocument =
        await prisma.document.findFirst({
          where: {
            id: documentId,

            candidate: {
              createdById: userId,
            },
          },
        });

      if (!existingDocument) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      // ========================================
      // VALIDATE TYPE
      // ========================================

      if (
        type &&
        !allowedDocumentTypes.includes(type)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid document type.",
        });
      }

      // ========================================
      // VALIDATE NAME
      // ========================================

      if (
        name !== undefined &&
        (!name || !name.trim())
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Document name cannot be empty.",
        });
      }

      // ========================================
      // UPDATE
      // ========================================

      const document =
        await prisma.document.update({
          where: {
            id: documentId,
          },

          data: {
            ...(name !== undefined && {
              name: name.trim(),
            }),

            ...(type !== undefined && {
              type,
            }),

            ...(description !== undefined && {
              description:
                description?.trim() || null,
            }),
          },
        });

      return res.status(200).json({
        success: true,
        message:
          "Document updated successfully.",
        document,
      });
    } catch (error) {
      console.error(
        "Update document error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update document.",
        error: error.message,
      });
    }
  }
);

// ========================================
// DELETE DOCUMENT
// DELETE /api/documents/:id
// ========================================

router.delete(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const documentId = Number(
        req.params.id
      );

      const userId = req.user.userId;

      // ========================================
      // VALIDATE ID
      // ========================================

      if (
        !Number.isInteger(documentId) ||
        documentId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid document ID.",
        });
      }

      // ========================================
      // FIND DOCUMENT + OWNERSHIP
      // ========================================

      const document =
        await prisma.document.findFirst({
          where: {
            id: documentId,

            candidate: {
              createdById: userId,
            },
          },
        });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      // ========================================
      // DELETE PHYSICAL FILE
      // ========================================

      if (document.fileUrl) {
        const relativeFilePath =
          document.fileUrl.replace(
            /^\/+/,
            ""
          );

        const filePath = path.join(
          __dirname,
          "..",
          relativeFilePath
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // ========================================
      // DELETE DATABASE RECORD
      // ========================================

      await prisma.document.delete({
        where: {
          id: documentId,
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Document deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete document error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete document.",
        error: error.message,
      });
    }
  }
);

// ========================================
// MULTER / UPLOAD ERROR HANDLER
// ========================================

router.use(
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "File size cannot exceed 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  }
);

// ========================================
// EXPORT ROUTER
// ========================================

export default router;