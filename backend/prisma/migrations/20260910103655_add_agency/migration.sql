-- CreateEnum
CREATE TYPE "AgencyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "Agency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "licenseNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "status" "AgencyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_registrationNumber_key" ON "Agency"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_licenseNumber_key" ON "Agency"("licenseNumber");

-- CreateIndex
CREATE INDEX "Agency_createdById_idx" ON "Agency"("createdById");

-- CreateIndex
CREATE INDEX "Agency_status_idx" ON "Agency"("status");

-- CreateIndex
CREATE INDEX "Agency_name_idx" ON "Agency"("name");

-- CreateIndex
CREATE INDEX "Agency_country_idx" ON "Agency"("country");

-- CreateIndex
CREATE INDEX "Agency_registrationNumber_idx" ON "Agency"("registrationNumber");

-- CreateIndex
CREATE INDEX "Agency_licenseNumber_idx" ON "Agency"("licenseNumber");

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
