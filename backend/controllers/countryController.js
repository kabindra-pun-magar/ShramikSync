import { prisma } from "../lib/prisma.js";

// ============================================================
// HELPERS
// ============================================================

const normalizeCode = (value) => {
    if (!value) return null;

    return value.trim().toUpperCase();
};

const normalizeName = (value) => {
    if (!value) return value;

    return value.trim();
};

// Get authenticated user's database ID
const getAuthenticatedUserId = (req) => {
    return req.user?.id ?? req.user?.userId ?? null;
};

// ============================================================
// GET ALL COUNTRIES
// GET /api/countries
// ============================================================

export const getCountries = async (req, res) => {
    try {
        const { search, status } = req.query;

        const where = {};

        // Search
        if (search) {
            const searchTerm = search.trim();

            where.OR = [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    iso2Code: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    iso3Code: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    callingCode: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ];
        }

        // Status filter
        if (status) {
            const normalizedStatus = status.toUpperCase();

            if (!["ACTIVE", "INACTIVE"].includes(normalizedStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid country status.",
                });
            }

            where.status = normalizedStatus;
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

// ============================================================
// GET COUNTRY BY ID
// GET /api/countries/:id
// ============================================================

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
            where: {
                id,
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

// ============================================================
// CREATE COUNTRY
// POST /api/countries
// ============================================================

export const createCountry = async (req, res) => {
    try {
        const {
            name,
            iso2Code,
            iso3Code,
            callingCode,
            status,
        } = req.body;

        // --------------------------------------------------------
        // Get authenticated user
        // --------------------------------------------------------

        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user ID is missing from the token.",
            });
        }

        // --------------------------------------------------------
        // Normalize input
        // --------------------------------------------------------

        const normalizedName = normalizeName(name);
        const normalizedIso2 = normalizeCode(iso2Code);
        const normalizedIso3 = normalizeCode(iso3Code);
        const normalizedCallingCode =
            callingCode?.trim() || null;

        // --------------------------------------------------------
        // Validate name
        // --------------------------------------------------------

        if (!normalizedName) {
            return res.status(400).json({
                success: false,
                message: "Country name is required.",
            });
        }

        // --------------------------------------------------------
        // Validate ISO 2
        // --------------------------------------------------------

        if (
            normalizedIso2 &&
            !/^[A-Z]{2}$/.test(normalizedIso2)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "ISO 2 code must contain exactly 2 letters.",
            });
        }

        // --------------------------------------------------------
        // Validate ISO 3
        // --------------------------------------------------------

        if (
            normalizedIso3 &&
            !/^[A-Z]{3}$/.test(normalizedIso3)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "ISO 3 code must contain exactly 3 letters.",
            });
        }

        // --------------------------------------------------------
        // Validate calling code
        // --------------------------------------------------------

        if (
            normalizedCallingCode &&
            !/^\+[1-9][0-9]{0,3}$/.test(
                normalizedCallingCode
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Calling code must be in a valid format such as +977.",
            });
        }

        // --------------------------------------------------------
        // Validate status
        // --------------------------------------------------------

        const countryStatus =
            status?.toUpperCase() || "ACTIVE";

        if (
            !["ACTIVE", "INACTIVE"].includes(countryStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid country status.",
            });
        }

        // --------------------------------------------------------
        // Create country
        // --------------------------------------------------------

        const country = await prisma.country.create({
            data: {
                name: normalizedName,
                iso2Code: normalizedIso2,
                iso3Code: normalizedIso3,
                callingCode: normalizedCallingCode,
                status: countryStatus,
                createdById: Number(userId),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Country created successfully.",
            country,
        });
    } catch (error) {
        console.error("Create country error:", error);

        // Duplicate unique field
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message:
                    "Country name or ISO code already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
            code: error.code || null,
        });
    }
};

// ============================================================
// UPDATE COUNTRY
// PUT /api/countries/:id
// ============================================================

export const updateCountry = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID.",
            });
        }

        // Check country exists
        const existingCountry =
            await prisma.country.findUnique({
                where: {
                    id,
                },
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

        // --------------------------------------------------------
        // Name
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // ISO 2
        // --------------------------------------------------------

        if (iso2Code !== undefined) {
            const normalizedIso2 =
                normalizeCode(iso2Code);

            if (
                normalizedIso2 &&
                !/^[A-Z]{2}$/.test(normalizedIso2)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "ISO 2 code must contain exactly 2 letters.",
                });
            }

            data.iso2Code = normalizedIso2;
        }

        // --------------------------------------------------------
        // ISO 3
        // --------------------------------------------------------

        if (iso3Code !== undefined) {
            const normalizedIso3 =
                normalizeCode(iso3Code);

            if (
                normalizedIso3 &&
                !/^[A-Z]{3}$/.test(normalizedIso3)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "ISO 3 code must contain exactly 3 letters.",
                });
            }

            data.iso3Code = normalizedIso3;
        }

        // --------------------------------------------------------
        // Calling code
        // --------------------------------------------------------

        if (callingCode !== undefined) {
            const normalizedCallingCode =
                callingCode?.trim() || null;

            if (
                normalizedCallingCode &&
                !/^\+[1-9][0-9]{0,3}$/.test(
                    normalizedCallingCode
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Calling code must be in a valid format such as +977.",
                });
            }

            data.callingCode = normalizedCallingCode;
        }

        // --------------------------------------------------------
        // Status
        // --------------------------------------------------------

        if (status !== undefined) {
            const normalizedStatus =
                status.toUpperCase();

            if (
                !["ACTIVE", "INACTIVE"].includes(
                    normalizedStatus
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid country status.",
                });
            }

            data.status = normalizedStatus;
        }

        // --------------------------------------------------------
        // Update
        // --------------------------------------------------------

        const country = await prisma.country.update({
            where: {
                id,
            },
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
                message:
                    "Country name or ISO code already exists.",
            });
        }

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Country not found.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update country.",
        });
    }
};

// ============================================================
// UPDATE COUNTRY STATUS
// PATCH /api/countries/:id/status
// ============================================================

export const updateCountryStatus = async (
    req,
    res
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID.",
            });
        }

        const { status } = req.body;

        const normalizedStatus =
            status?.toUpperCase();

        if (
            !["ACTIVE", "INACTIVE"].includes(
                normalizedStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be ACTIVE or INACTIVE.",
            });
        }

        const country = await prisma.country.update({
            where: {
                id,
            },
            data: {
                status: normalizedStatus,
            },
        });

        return res.status(200).json({
            success: true,
            message:
                "Country status updated successfully.",
            country,
        });
    } catch (error) {
        console.error(
            "Update country status error:",
            error
        );

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Country not found.",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to update country status.",
        });
    }
};

// ============================================================
// DELETE COUNTRY
// DELETE /api/countries/:id
// ============================================================

export const deleteCountry = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid country ID.",
            });
        }

        // Check country exists
        const country =
            await prisma.country.findUnique({
                where: {
                    id,
                },
            });

        if (!country) {
            return res.status(404).json({
                success: false,
                message: "Country not found.",
            });
        }

        // Delete
        await prisma.country.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Country deleted successfully.",
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