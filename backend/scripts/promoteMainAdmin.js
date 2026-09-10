import { prisma } from "../lib/prisma.js";

const MAIN_ADMIN_EMAIL = "admin@shramiksync.com";

async function promoteMainAdmin() {
  try {
    console.log("Looking for main admin account...");

    const user = await prisma.user.findUnique({
      where: {
        email: MAIN_ADMIN_EMAIL,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      console.error(
        `User with email ${MAIN_ADMIN_EMAIL} was not found.`
      );
      process.exit(1);
    }

    console.log("Account found:");
    console.log(user);

    if (user.role === "SUPER_ADMIN") {
      console.log(
        "This account is already SUPER_ADMIN."
      );
      process.exit(0);
    }

    if (user.role !== "ADMIN") {
      console.error(
        `Unexpected current role: ${user.role}`
      );
      console.error(
        "Expected the account to currently be ADMIN."
      );
      process.exit(1);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: "SUPER_ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    console.log("\nAccount successfully promoted:");
    console.log(updatedUser);

    console.log(
      "\nIMPORTANT: Log out and log in again to obtain a new JWT."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to promote main admin:",
      error
    );

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

promoteMainAdmin();