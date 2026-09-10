import express from "express";

import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  updateCountryStatus,
  deleteCountry,
} from "../controllers/countryController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getCountries);
router.get("/:id", getCountryById);

router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  createCountry
);

router.put(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  updateCountry
);

router.patch(
  "/:id/status",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  updateCountryStatus
);

router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN"),
  deleteCountry
);

export default router;