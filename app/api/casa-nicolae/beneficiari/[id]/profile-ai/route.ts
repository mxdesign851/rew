import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiUser } from '@/lib/session';
import { generateBeneficiaryProfile } from '@/lib/casa-nicolae-ai';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  const body = await req.json();
  const profile = await generateBeneficiaryProfile({
    firstName: body.firstName,
    age: body.age,
    sex: body.sex,
    location: body.location,
    hasFamily: body.hasFamily,
    housingStatus: body.housingStatus,
    familyContactFreq: body.familyContactFreq,
    institutionalHistory: body.institutionalHistory,
    knownIllnesses: body.knownIllnesses,
    medication: body.medication,
    disabilities: body.disabilities,
    communicationLevel: body.communicationLevel,
    stressReaction: body.stressReaction,
    relationStyle: body.relationStyle,
    autonomyLevel: body.autonomyLevel,
    sleepQuality: body.sleepQuality,
    appetiteLevel: body.appetiteLevel,
    sadnessFrequent: body.sadnessFrequent,
    anxiety: body.anxiety,
    anger: body.anger,
    apathy: body.apathy,
    hopeMotivation: body.hopeMotivation,
    observations: body.observations
  });

  await prisma.beneficiary.update({
    where: { id: params.id },
    data: { aiProfile: profile }
  });

  return NextResponse.json({ profile });
}
