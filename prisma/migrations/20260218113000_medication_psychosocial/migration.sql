-- CreateEnum
CREATE TYPE "MedicationCategory" AS ENUM (
    'CARDIO',
    'DIABET',
    'GASTRO',
    'RESPIRATOR',
    'NEURO',
    'PSIHIATRIC',
    'ANTIBIOTICE',
    'DURERE',
    'ALERGII',
    'DERMATO',
    'VITAMINE',
    'ALTELE'
);

-- CreateEnum
CREATE TYPE "FamilySupportLevel" AS ENUM ('DA', 'NU', 'PARTIAL');

-- CreateEnum
CREATE TYPE "HousingStatus" AS ENUM ('FARA_ADAPOST', 'CENTRU', 'FAMILIE', 'ALTA');

-- CreateEnum
CREATE TYPE "CommunicationLevel" AS ENUM ('MIC', 'MEDIU', 'BUN');

-- CreateEnum
CREATE TYPE "StressReaction" AS ENUM ('CALM', 'AGITAT', 'CRIZE');

-- CreateEnum
CREATE TYPE "RelationshipStyle" AS ENUM ('RETRAS', 'SOCIABIL', 'AGRESIV');

-- CreateEnum
CREATE TYPE "AutonomyLevel" AS ENUM ('DEPENDENT', 'PARTIAL', 'INDEPENDENT');

-- CreateEnum
CREATE TYPE "SleepQuality" AS ENUM ('BUN', 'SLAB');

-- CreateEnum
CREATE TYPE "AppetiteLevel" AS ENUM ('NORMAL', 'SCAZUT');

-- CreateTable
CREATE TABLE "MedicationItem" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "MedicationCategory" NOT NULL,
    "shelf" TEXT,
    "stockQuantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minStockThreshold" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'cutii',
    "dailyUsage" DECIMAL(10,2),
    "lastUnitPrice" DECIMAL(10,2),
    "lastPurchaseAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "notifyOnLowStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationPurchase" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(10,2),
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicationPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationNotificationPreference" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "enablePhoneAlerts" BOOLEAN NOT NULL DEFAULT false,
    "enableLowStockAlerts" BOOLEAN NOT NULL DEFAULT true,
    "enableExpiryAlerts" BOOLEAN NOT NULL DEFAULT true,
    "expiryAlertDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PsychosocialProfile" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT,
    "internalName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "locationCenter" TEXT NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL,
    "responsiblePerson" TEXT NOT NULL,
    "familySupport" "FamilySupportLevel" NOT NULL,
    "housingStatus" "HousingStatus" NOT NULL,
    "familyContactFrequency" TEXT,
    "institutionalizationHistory" TEXT,
    "knownDiseases" BOOLEAN,
    "medicationInfo" TEXT,
    "limitations" TEXT,
    "previousPsychEvaluation" BOOLEAN,
    "communicationLevel" "CommunicationLevel" NOT NULL,
    "stressReaction" "StressReaction" NOT NULL,
    "relationshipStyle" "RelationshipStyle" NOT NULL,
    "autonomyLevel" "AutonomyLevel" NOT NULL,
    "sleepQuality" "SleepQuality" NOT NULL,
    "appetite" "AppetiteLevel" NOT NULL,
    "sadnessFrequent" BOOLEAN NOT NULL DEFAULT false,
    "anxiety" BOOLEAN NOT NULL DEFAULT false,
    "anger" BOOLEAN NOT NULL DEFAULT false,
    "apathy" BOOLEAN NOT NULL DEFAULT false,
    "hopeMotivation" BOOLEAN NOT NULL DEFAULT false,
    "photoConsent" BOOLEAN NOT NULL DEFAULT false,
    "photoReference" TEXT,
    "contextPersonal" TEXT NOT NULL,
    "emotionalProfile" TEXT NOT NULL,
    "mainNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "risks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "staffRecommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "supportPlan" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "observations" TEXT,
    "signatureResponsible" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PsychosocialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicationItem_workspaceId_category_idx" ON "MedicationItem"("workspaceId", "category");

-- CreateIndex
CREATE INDEX "MedicationItem_workspaceId_stockQuantity_idx" ON "MedicationItem"("workspaceId", "stockQuantity");

-- CreateIndex
CREATE INDEX "MedicationItem_workspaceId_expiresAt_idx" ON "MedicationItem"("workspaceId", "expiresAt");

-- CreateIndex
CREATE INDEX "MedicationPurchase_workspaceId_purchasedAt_idx" ON "MedicationPurchase"("workspaceId", "purchasedAt");

-- CreateIndex
CREATE INDEX "MedicationPurchase_itemId_purchasedAt_idx" ON "MedicationPurchase"("itemId", "purchasedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MedicationNotificationPreference_workspaceId_key" ON "MedicationNotificationPreference"("workspaceId");

-- CreateIndex
CREATE INDEX "PsychosocialProfile_workspaceId_assessmentDate_idx" ON "PsychosocialProfile"("workspaceId", "assessmentDate");

-- CreateIndex
CREATE INDEX "PsychosocialProfile_workspaceId_createdAt_idx" ON "PsychosocialProfile"("workspaceId", "createdAt");

-- AddForeignKey
ALTER TABLE "MedicationItem" ADD CONSTRAINT "MedicationItem_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPurchase" ADD CONSTRAINT "MedicationPurchase_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPurchase" ADD CONSTRAINT "MedicationPurchase_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MedicationItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationPurchase" ADD CONSTRAINT "MedicationPurchase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationNotificationPreference" ADD CONSTRAINT "MedicationNotificationPreference_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychosocialProfile" ADD CONSTRAINT "PsychosocialProfile_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PsychosocialProfile" ADD CONSTRAINT "PsychosocialProfile_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
