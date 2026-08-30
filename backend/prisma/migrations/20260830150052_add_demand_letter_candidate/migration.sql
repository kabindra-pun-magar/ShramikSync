-- CreateTable
CREATE TABLE "DemandLetterCandidate" (
    "id" SERIAL NOT NULL,
    "demandLetterId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandLetterCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DemandLetterCandidate_demandLetterId_idx" ON "DemandLetterCandidate"("demandLetterId");

-- CreateIndex
CREATE INDEX "DemandLetterCandidate_candidateId_idx" ON "DemandLetterCandidate"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "DemandLetterCandidate_demandLetterId_candidateId_key" ON "DemandLetterCandidate"("demandLetterId", "candidateId");

-- AddForeignKey
ALTER TABLE "DemandLetterCandidate" ADD CONSTRAINT "DemandLetterCandidate_demandLetterId_fkey" FOREIGN KEY ("demandLetterId") REFERENCES "DemandLetter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandLetterCandidate" ADD CONSTRAINT "DemandLetterCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
