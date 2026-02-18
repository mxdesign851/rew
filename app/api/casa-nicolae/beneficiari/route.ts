import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiUser } from '@/lib/session';

export async function POST(req: Request) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  const body = await req.json();
  const {
    firstName,
    age,
    sex,
    location,
    evaluationDate,
    responsiblePerson,
    hasFamily,
    housingStatus,
    familyContactFreq,
    institutionalHistory,
    knownIllnesses,
    medication,
    disabilities,
    hasPsychologicalEval,
    communicationLevel,
    stressReaction,
    relationStyle,
    autonomyLevel,
    sleepQuality,
    appetiteLevel,
    sadnessFrequent,
    anxiety,
    anger,
    apathy,
    hopeMotivation,
    observations
  } = body;

  if (!firstName || !location || !responsiblePerson || !evaluationDate) {
    return NextResponse.json(
      { error: 'Lipsesc câmpuri obligatorii' },
      { status: 400 }
    );
  }

  const b = await prisma.beneficiary.create({
    data: {
      firstName: String(firstName),
      age: Number(age) || 0,
      sex: String(sex || 'M'),
      location: String(location),
      evaluationDate: new Date(evaluationDate),
      responsiblePerson: String(responsiblePerson),
      hasFamily: String(hasFamily || 'nu'),
      housingStatus: housingStatus || 'CENTRU',
      familyContactFreq: familyContactFreq ? String(familyContactFreq) : null,
      institutionalHistory: institutionalHistory
        ? String(institutionalHistory)
        : null,
      knownIllnesses: knownIllnesses ? String(knownIllnesses) : null,
      medication: medication ? String(medication) : null,
      disabilities: disabilities ? String(disabilities) : null,
      hasPsychologicalEval: Boolean(hasPsychologicalEval),
      communicationLevel: communicationLevel || 'MEDIU',
      stressReaction: stressReaction || 'CALM',
      relationStyle: relationStyle || 'SOCIABIL',
      autonomyLevel: autonomyLevel || 'PARTIAL',
      sleepQuality: sleepQuality || 'BUN',
      appetiteLevel: appetiteLevel || 'NORMAL',
      sadnessFrequent: Boolean(sadnessFrequent),
      anxiety: Boolean(anxiety),
      anger: Boolean(anger),
      apathy: Boolean(apathy),
      hopeMotivation: Boolean(hopeMotivation),
      observations: observations ? String(observations) : null
    }
  });

  return NextResponse.json(b);
}
