-- CreateEnum
CREATE TYPE "MedicationCategoryType" AS ENUM ('CARDIO', 'DIABET', 'GASTRO', 'RESPIRATOR', 'NEURO', 'PSIHIATRIC', 'ANTIBIOTICE', 'DURERE', 'ALERGII', 'DERMATO', 'VITAMINE', 'ALTELE');

-- CreateEnum
CREATE TYPE "HousingStatus" AS ENUM ('FARA_ADAPOST', 'CENTRU', 'FAMILIE');

-- CreateEnum
CREATE TYPE "CommunicationLevel" AS ENUM ('MIC', 'MEDIU', 'BUN');

-- CreateEnum
CREATE TYPE "StressReaction" AS ENUM ('CALM', 'AGITAT', 'CRIZE');

-- CreateEnum
CREATE TYPE "RelationStyle" AS ENUM ('RETRAS', 'SOCIABIL', 'AGRESIV');

-- CreateEnum
CREATE TYPE "AutonomyLevel" AS ENUM ('DEPENDENT', 'PARTIAL', 'INDEPENDENT');

-- CreateEnum
CREATE TYPE "SleepQuality" AS ENUM ('BUN', 'SLAB');

-- CreateEnum
CREATE TYPE "AppetiteLevel" AS ENUM ('NORMAL', 'SCAZUT');

-- CreateTable
CREATE TABLE "MedicationCategory" (
    "id" TEXT NOT NULL,
    "type" "MedicationCategoryType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minQuantity" INTEGER NOT NULL DEFAULT 5,
    "unit" TEXT NOT NULL DEFAULT 'buc',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL,
    "responsiblePerson" TEXT NOT NULL,
    "hasFamily" TEXT NOT NULL,
    "housingStatus" "HousingStatus" NOT NULL,
    "familyContactFreq" TEXT,
    "institutionalHistory" TEXT,
    "knownIllnesses" TEXT,
    "medication" TEXT,
    "disabilities" TEXT,
    "hasPsychologicalEval" BOOLEAN NOT NULL DEFAULT false,
    "communicationLevel" "CommunicationLevel" NOT NULL,
    "stressReaction" "StressReaction" NOT NULL,
    "relationStyle" "RelationStyle" NOT NULL,
    "autonomyLevel" "AutonomyLevel" NOT NULL,
    "sleepQuality" "SleepQuality" NOT NULL,
    "appetiteLevel" "AppetiteLevel" NOT NULL,
    "sadnessFrequent" BOOLEAN NOT NULL DEFAULT false,
    "anxiety" BOOLEAN NOT NULL DEFAULT false,
    "anger" BOOLEAN NOT NULL DEFAULT false,
    "apathy" BOOLEAN NOT NULL DEFAULT false,
    "hopeMotivation" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT,
    "observations" TEXT,
    "aiProfile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationNotification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "medicationId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicationNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicationCategory_type_key" ON "MedicationCategory"("type");

-- CreateIndex
CREATE INDEX "Medication_categoryId_idx" ON "Medication"("categoryId");

-- CreateIndex
CREATE INDEX "Beneficiary_evaluationDate_idx" ON "Beneficiary"("evaluationDate");

-- CreateIndex
CREATE INDEX "MedicationNotification_isRead_idx" ON "MedicationNotification"("isRead");

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MedicationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
