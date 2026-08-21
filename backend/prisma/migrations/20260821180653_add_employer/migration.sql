-- CreateEnum
CREATE TYPE "EmployerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "Employer" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "industry" TEXT,
    "companyType" TEXT,
    "status" "EmployerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Employer_createdById_idx" ON "Employer"("createdById");

-- CreateIndex
CREATE INDEX "Employer_status_idx" ON "Employer"("status");

-- CreateIndex
CREATE INDEX "Employer_companyName_idx" ON "Employer"("companyName");

-- AddForeignKey
ALTER TABLE "Employer" ADD CONSTRAINT "Employer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
