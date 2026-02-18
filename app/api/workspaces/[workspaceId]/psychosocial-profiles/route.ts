import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiUserOrThrow } from '@/lib/api-auth';
import { jsonError, HttpError } from '@/lib/http';
import {
  APPETITE_LEVELS,
  AUTONOMY_LEVELS,
  COMMUNICATION_LEVELS,
  FAMILY_SUPPORT_LEVELS,
  HOUSING_STATUSES,
  RELATIONSHIP_STYLES,
  SLEEP_QUALITIES,
  STRESS_REACTIONS,
  generatePsychosocialProfile
} from '@/lib/psychosocial';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeText } from '@/lib/sanitize';
import { assertWorkspaceAccess } from '@/lib/tenant';

type Params = { params: { workspaceId: string } };

const optionalBooleanSchema = z.union([z.boolean(), z.null()]).optional();

const psychosocialSchema = z.object({
  internalName: z.string().min(2).max(80),
  age: z.coerce.number().int().min(0).max(120),
  sex: z.string().min(1).max(32),
  locationCenter: z.string().min(2).max(120),
  assessmentDate: z.string(),
  responsiblePerson: z.string().min(2).max(120),
  familySupport: z.enum(FAMILY_SUPPORT_LEVELS),
  housingStatus: z.enum(HOUSING_STATUSES),
  familyContactFrequency: z.string().max(160).optional().nullable(),
  institutionalizationHistory: z.string().max(500).optional().nullable(),
  knownDiseases: optionalBooleanSchema,
  medicationInfo: z.string().max(500).optional().nullable(),
  limitations: z.string().max(500).optional().nullable(),
  previousPsychEvaluation: optionalBooleanSchema,
  communicationLevel: z.enum(COMMUNICATION_LEVELS),
  stressReaction: z.enum(STRESS_REACTIONS),
  relationshipStyle: z.enum(RELATIONSHIP_STYLES),
  autonomyLevel: z.enum(AUTONOMY_LEVELS),
  sleepQuality: z.enum(SLEEP_QUALITIES),
  appetite: z.enum(APPETITE_LEVELS),
  sadnessFrequent: z.boolean().default(false),
  anxiety: z.boolean().default(false),
  anger: z.boolean().default(false),
  apathy: z.boolean().default(false),
  hopeMotivation: z.boolean().default(false),
  photoConsent: z.boolean().default(false),
  photoReference: z.string().max(250).optional().nullable(),
  observations: z.string().max(1000).optional().nullable(),
  signatureResponsible: z.string().max(120).optional().nullable()
});

function parseAssessmentDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpError(400, 'Data evaluarii este invalida');
  }
  return parsed;
}

function serializeProfile(profile: {
  id: string;
  internalName: string;
  age: number;
  sex: string;
  locationCenter: string;
  assessmentDate: Date;
  responsiblePerson: string;
  familySupport: string;
  housingStatus: string;
  communicationLevel: string;
  stressReaction: string;
  relationshipStyle: string;
  autonomyLevel: string;
  sleepQuality: string;
  appetite: string;
  sadnessFrequent: boolean;
  anxiety: boolean;
  anger: boolean;
  apathy: boolean;
  hopeMotivation: boolean;
  contextPersonal: string;
  emotionalProfile: string;
  mainNeeds: string[];
  risks: string[];
  staffRecommendations: string[];
  supportPlan: string[];
  observations: string | null;
  signatureResponsible: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...profile,
    assessmentDate: profile.assessmentDate.toISOString(),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };
}

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN, Role.MEMBER]);

    const profiles = await prisma.psychosocialProfile.findMany({
      where: { workspaceId: params.workspaceId },
      orderBy: { assessmentDate: 'desc' },
      take: 50
    });

    return NextResponse.json({ profiles: profiles.map(serializeProfile) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN, Role.MEMBER]);
    const parsed = psychosocialSchema.parse(await request.json());
    const assessmentDate = parseAssessmentDate(parsed.assessmentDate);

    const internalName = sanitizeText(parsed.internalName, 80);
    const sex = sanitizeText(parsed.sex, 32);
    const locationCenter = sanitizeText(parsed.locationCenter, 120);
    const responsiblePerson = sanitizeText(parsed.responsiblePerson, 120);
    const familyContactFrequency = sanitizeOptionalText(parsed.familyContactFrequency, 160);
    const institutionalizationHistory = sanitizeOptionalText(parsed.institutionalizationHistory, 500);
    const medicationInfo = sanitizeOptionalText(parsed.medicationInfo, 500);
    const limitations = sanitizeOptionalText(parsed.limitations, 500);
    const observations = sanitizeOptionalText(parsed.observations, 1000);
    const photoReference = sanitizeOptionalText(parsed.photoReference, 250);
    const signatureResponsible = sanitizeOptionalText(parsed.signatureResponsible, 120);

    const generated = generatePsychosocialProfile({
      internalName,
      age: parsed.age,
      sex,
      locationCenter,
      assessmentDate,
      responsiblePerson,
      familySupport: parsed.familySupport,
      housingStatus: parsed.housingStatus,
      familyContactFrequency,
      institutionalizationHistory,
      knownDiseases: parsed.knownDiseases ?? null,
      medicationInfo,
      limitations,
      previousPsychEvaluation: parsed.previousPsychEvaluation ?? null,
      communicationLevel: parsed.communicationLevel,
      stressReaction: parsed.stressReaction,
      relationshipStyle: parsed.relationshipStyle,
      autonomyLevel: parsed.autonomyLevel,
      sleepQuality: parsed.sleepQuality,
      appetite: parsed.appetite,
      sadnessFrequent: parsed.sadnessFrequent,
      anxiety: parsed.anxiety,
      anger: parsed.anger,
      apathy: parsed.apathy,
      hopeMotivation: parsed.hopeMotivation,
      observations
    });

    const profile = await prisma.psychosocialProfile.create({
      data: {
        workspaceId: params.workspaceId,
        createdById: user.id,
        internalName,
        age: parsed.age,
        sex,
        locationCenter,
        assessmentDate,
        responsiblePerson,
        familySupport: parsed.familySupport,
        housingStatus: parsed.housingStatus,
        familyContactFrequency,
        institutionalizationHistory,
        knownDiseases: parsed.knownDiseases ?? null,
        medicationInfo,
        limitations,
        previousPsychEvaluation: parsed.previousPsychEvaluation ?? null,
        communicationLevel: parsed.communicationLevel,
        stressReaction: parsed.stressReaction,
        relationshipStyle: parsed.relationshipStyle,
        autonomyLevel: parsed.autonomyLevel,
        sleepQuality: parsed.sleepQuality,
        appetite: parsed.appetite,
        sadnessFrequent: parsed.sadnessFrequent,
        anxiety: parsed.anxiety,
        anger: parsed.anger,
        apathy: parsed.apathy,
        hopeMotivation: parsed.hopeMotivation,
        photoConsent: parsed.photoConsent,
        photoReference,
        contextPersonal: generated.contextPersonal,
        emotionalProfile: generated.emotionalProfile,
        mainNeeds: generated.mainNeeds,
        risks: generated.risks,
        staffRecommendations: generated.staffRecommendations,
        supportPlan: generated.supportPlan,
        observations,
        signatureResponsible
      }
    });

    return NextResponse.json({ profile: serializeProfile(profile) }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
