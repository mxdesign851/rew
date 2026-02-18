'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

type BeneficiaryData = {
  firstName: string;
  age: number;
  sex: string;
  location: string;
  hasFamily: string;
  housingStatus: string;
  familyContactFreq?: string | null;
  institutionalHistory?: string | null;
  knownIllnesses?: string | null;
  medication?: string | null;
  disabilities?: string | null;
  communicationLevel: string;
  stressReaction: string;
  relationStyle: string;
  autonomyLevel: string;
  sleepQuality: string;
  appetiteLevel: string;
  sadnessFrequent: boolean;
  anxiety: boolean;
  anger: boolean;
  apathy: boolean;
  hopeMotivation: boolean;
  observations?: string | null;
};

export function BeneficiarProfilClient({
  beneficiaryId,
  initialProfile,
  beneficiaryData
}: {
  beneficiaryId: string;
  initialProfile: string | null;
  beneficiaryData: BeneficiaryData;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/casa-nicolae/beneficiari/${beneficiaryId}/profile-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beneficiaryData)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Eroare la generare');
      }
      const { profile: generated } = await res.json();
      setProfile(generated);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare');
    } finally {
      setLoading(false);
    }
  }

  if (!profile && !loading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Profil orientativ de sprijin – NU pune diagnostice. Oferă recomandări pentru personal.
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Se generează...' : 'Generează profil AI'}
        </button>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="btn btn-secondary text-sm"
        >
          {loading ? 'Se regenerează...' : 'Regenerează'}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="whitespace-pre-wrap rounded-lg border border-slate-700 bg-slate-800/30 p-4 text-sm leading-relaxed text-slate-300">
        {profile}
      </div>
    </div>
  );
}
