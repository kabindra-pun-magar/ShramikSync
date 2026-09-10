import { prisma } from "../lib/prisma.js";

const normalizeCode = (value) => {
  if (!value) return null;
  return value.trim().toUpperCase();
};

const normalizeName = (value) => {
  if (!value) return value;
  return value.trim();
};

// GET /api/countries
export const getCountries = async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          iso2Code: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          iso3Code: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          callingCode: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    if (status) {
      if (!["ACTIVE", "INACTIVE"].includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid country status.",
        });
      }

      where.status = status.toUpperCase();
    }

    const countries = await prisma.country.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: countries.length,
      countries,
    });
  } catch (error) {
    console.error("Get countries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch countries.",
    });
  }
};

// GET /api/countries/:id
export const getCountryById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country ID.",
      });
    }

    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found.",
      });
    }

    return res.status(200).json({
      success: true,
      country,
    });
  } catch (error) {
    console.error("Get country error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch country.",
    });
  }
};

// POST /api/countries
export const createCountry = async (req, res) => {
  try {
    const {
      name,
      iso2Code,
      iso3Code,
      callingCode,
      status,
    } = req.body;

    const normalizedName = normalizeName(name);
    const normalizedIso2 = normalizeCode(iso2Code);
    const normalizedIso3 = normalizeCode(iso3Code);
    const normalizedCallingCode = callingCode?.trim() || null;

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Country name is required.",
      });
    }

    if (normalizedIso2 && !/^[A-Z]{2}$/.test(normalizedIso2)) {
      return res.status(400).json({
        success: false,
        message: "ISO 2 code must contain exactly 2 letters.",
      });
    }

    if (normalizedIso3 && !/^[A-Z]{3}$/.test(normalizedIso3)) {
      return res.status(400).json({
        success: false,
        message: "ISO 3 code must contain exactly 3 letters.",
      });
    }

    if (normalizedCallingCode && !/^\+[1-9][0-9]{0,3}$/.test(normalizedCallingCode)) {
      return res.status(400).json({
        success: false,
        message: "Calling code must be in a valid format such as +977.",
      });
    }

    let countryStatus = status?.toUpperCase() || "ACTIVE";

    if (!["ACTIVE", "INACTIVE"].includes(countryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country status.",
      });
    }

    const country = await prisma.country.create({
      data: {
        name: normalizedName,
        iso2Code: normalizedIso2,
        iso3Code: normalizedIso3,
        callingCode: normalizedCallingCode,
        status: countryStatus,
        createdById: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Country created successfully.",
      country,
    });
  } catch (error) {
    console.error("Create country error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Country name or ISO code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create country.",
    });
  }
};

// PUT /api/countries/:id
export const updateCountry = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country ID.",
      });
    }

    const existingCountry = await prisma.country.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      return res.status(404).json({
        success: false,
        message: "Country not found.",
      });
    }

    const {
      name,
      iso2Code,
      iso3Code,
      callingCode,
      status,
    } = req.body;

    const data = {};

    if (name !== undefined) {
      const normalizedName = normalizeName(name);

      if (!normalizedName) {
        return res.status(400).json({
          success: false,
          message: "Country name cannot be empty.",
        });
      }

      data.name = normalizedName;
    }

    if (iso2Code !== undefined) {
      const normalizedIso2 = normalizeCode(iso2Code);

      if (normalizedIso2 && !/^[A-Z]{2}$/.test(normalizedIso2)) {
        return res.status(400).json({
          success: false,
          message: "ISO 2 code must contain exactly 2 letters.",
        });
      }

      data.iso2Code = normalizedIso2;
    }

    if (iso3Code !== undefined) {
      const normalizedIso3 = normalizeCode(iso3Code);

      if (normalizedIso3 && !/^[A-Z]{3}$/.test(normalizedIso3)) {
        return res.status(400).json({
          success: false,
          message: "ISO 3 code must contain exactly 3 letters.",
        });
      }

      data.iso3Code = normalizedIso3;
    }

    if (callingCode !== undefined) {
      const normalizedCallingCode = callingCode?.trim() || null;

      if (
        normalizedCallingCode &&
        !/^\+[1-9][0-9]{0,3}$/.test(normalizedCallingCode)
      ) {
        return res.status(400).json({
          success: false,
          message: "Calling code must be in a valid format such as +977.",
        });
      }

      data.callingCode = normalizedCallingCode;
    }

    if (status !== undefined) {
      const normalizedStatus = status.toUpperCase();

      if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid country status.",
        });
      }

      data.status = normalizedStatus;
    }

    const country = await prisma.country.update({
      where: { id },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Country updated successfully.",
      country,
    });
  } catch (error) {
    console.error("Update country error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Country name or ISO code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update country.",
    });
  }
};

// PATCH /api/countries/:id/status
export const updateCountryStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country ID.",
      });
    }

    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE.",
      });
    }

    const country = await prisma.country.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Country status updated successfully.",
      country,
    });
  } catch (error) {
    console.error("Update country status error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Country not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update country status.",
    });
  }
};

// DELETE /api/countries/:id
export const deleteCountry = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country ID.",
      });
    }

    const country = await prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found.",
      });
    }

    await prisma.country.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Country deleted successfully.",
    });
  } catch (error) {
    console.error("Delete country error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete country.",
    });
  }
};