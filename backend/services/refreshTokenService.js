import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/refreshToken.js";

const REFRESH_TOKEN_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 7
);

/**
 * Creates a refresh token for a user.
 *
 * The raw token is returned to the client.
 * Only the SHA-256 hash is stored in the database.
 */
export const createRefreshToken = async (userId) => {
  const rawToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(rawToken);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return {
    token: rawToken,
    expiresAt,
  };
};

/**
 * Finds and validates a refresh token.
 */
export const findValidRefreshToken = async (rawToken) => {
  const tokenHash = hashRefreshToken(rawToken);

  const refreshToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!refreshToken) {
    return null;
  }

  if (refreshToken.revokedAt) {
    return null;
  }

  if (refreshToken.expiresAt <= new Date()) {
    return null;
  }

  if (!refreshToken.user.isActive) {
    return null;
  }

  return refreshToken;
};

/**
 * Revokes a refresh token.
 */
export const revokeRefreshToken = async (rawToken) => {
  const tokenHash = hashRefreshToken(rawToken);

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

/**
 * Revokes all refresh tokens belonging to a user.
 */
export const revokeAllUserRefreshTokens = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};