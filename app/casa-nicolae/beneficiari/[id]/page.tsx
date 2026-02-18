import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import {
  HOUSING_LABELS,
  COMMUNICATION_LABELS,
  RELATION_LABELS,
  AUTONOMY_LABELS
} from '@/lib/casa-nicolae';
import { BeneficiarProfilClient } from './beneficiar-profil-client';

export default async function BeneficiarProfilPage({
  params
}: {
  params: { id: string };
}) {
  const b = await prisma.beneficiary.findUnique({
    where: { id: params.id }
  });

  if (!b) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/casa-nicolae/beneficiari"
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            ← Înapoi
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">
            Profil sprijin – {b.firstName}
          </h1>
        </div>
        <div className="flex gap-2">
          <a
            href={`/api/casa-nicolae/beneficiari/${b.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Descarcă PDF (fișă dosar)
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-slate-200">Date identificare</h2>
          <dl className="grid gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500">Prenume:</dt>
              <dd className="text-slate-200">{b.firstName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Vârstă:</dt>
              <dd className="text-slate-200">{b.age}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Sex:</dt>
              <dd className="text-slate-200">{b.sex}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Locație:</dt>
              <dd className="text-slate-200">{b.location}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Data evaluării:</dt>
              <dd className="text-slate-200">
                {new Date(b.evaluationDate).toLocaleDateString('ro-RO')}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Responsabil:</dt>
              <dd className="text-slate-200">{b.responsiblePerson}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-slate-200">Rezumat social</h2>
          <dl className="grid gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500">Familie:</dt>
              <dd className="text-slate-200">{b.hasFamily}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Stare locativă:</dt>
              <dd className="text-slate-200">
                {HOUSING_LABELS[b.housingStatus] ?? b.housingStatus}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Contact familie:</dt>
              <dd className="text-slate-200">{b.familyContactFreq || '-'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Comunicare:</dt>
              <dd className="text-slate-200">
                {COMMUNICATION_LABELS[b.communicationLevel] ?? b.communicationLevel}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Relaționare:</dt>
              <dd className="text-slate-200">
                {RELATION_LABELS[b.relationStyle] ?? b.relationStyle}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Autonomie:</dt>
              <dd className="text-slate-200">
                {AUTONOMY_LABELS[b.autonomyLevel] ?? b.autonomyLevel}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-semibold text-slate-200">
          Profil psihosocial orientativ (AI)
        </h2>
        <BeneficiarProfilClient
          beneficiaryId={b.id}
          initialProfile={b.aiProfile}
          beneficiaryData={{
            firstName: b.firstName,
            age: b.age,
            sex: b.sex,
            location: b.location,
            hasFamily: b.hasFamily,
            housingStatus: b.housingStatus,
            familyContactFreq: b.familyContactFreq,
            institutionalHistory: b.institutionalHistory,
            knownIllnesses: b.knownIllnesses,
            medication: b.medication,
            disabilities: b.disabilities,
            communicationLevel: b.communicationLevel,
            stressReaction: b.stressReaction,
            relationStyle: b.relationStyle,
            autonomyLevel: b.autonomyLevel,
            sleepQuality: b.sleepQuality,
            appetiteLevel: b.appetiteLevel,
            sadnessFrequent: b.sadnessFrequent,
            anxiety: b.anxiety,
            anger: b.anger,
            apathy: b.apathy,
            hopeMotivation: b.hopeMotivation,
            observations: b.observations
          }}
        />
      </div>

      {b.observations && (
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-slate-200">Observații</h2>
          <p className="whitespace-pre-wrap text-sm text-slate-300">
            {b.observations}
          </p>
        </div>
      )}
    </div>
  );
}
