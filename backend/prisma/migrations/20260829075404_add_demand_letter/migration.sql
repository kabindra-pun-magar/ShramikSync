-- CreateEnum
CREATE TYPE "DemandLetterStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "DemandLetter" (
    "id" SERIAL NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "numberOfWorkers" INTEGER NOT NULL,
    "salary" TEXT,
    "contractDuration" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT,
    "status" "DemandLetterStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "DemandLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemandLetter_referenceNumber_key" ON "DemandLetter"("referenceNumber");

-- CreateIndex
CREATE INDEX "DemandLetter_createdById_idx" ON "DemandLetter"("createdById");

-- CreateIndex
CREATE INDEX "DemandLetter_status_idx" ON "DemandLetter"("status");

-- CreateIndex
CREATE INDEX "DemandLetter_country_idx" ON "DemandLetter"("country");

-- CreateIndex
CREATE INDEX "DemandLetter_referenceNumber_idx" ON "DemandLetter"("referenceNumber");

-- AddForeignKey
ALTER TABLE "DemandLetter" ADD CONSTRAINT "DemandLetter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
