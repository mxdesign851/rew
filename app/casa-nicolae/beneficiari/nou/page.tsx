'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HOUSING_LABELS,
  COMMUNICATION_LABELS,
  STRESS_LABELS,
  RELATION_LABELS,
  AUTONOMY_LABELS,
  SLEEP_LABELS,
  APPETITE_LABELS
} from '@/lib/casa-nicolae';

const HOUSING_OPTIONS = Object.entries(HOUSING_LABELS);
const COMM_OPTIONS = Object.entries(COMMUNICATION_LABELS);
const STRESS_OPTIONS = Object.entries(STRESS_LABELS);
const RELATION_OPTIONS = Object.entries(RELATION_LABELS);
const AUTONOMY_OPTIONS = Object.entries(AUTONOMY_LABELS);
const SLEEP_OPTIONS = Object.entries(SLEEP_LABELS);
const APPETITE_OPTIONS = Object.entries(APPETITE_LABELS);

const defaultForm = {
  firstName: '',
  age: 40,
  sex: 'M',
  location: '',
  evaluationDate: new Date().toISOString().slice(0, 10),
  responsiblePerson: '',
  hasFamily: 'da',
  housingStatus: 'CENTRU' as const,
  familyContactFreq: '',
  institutionalHistory: '',
  knownIllnesses: '',
  medication: '',
  disabilities: '',
  hasPsychologicalEval: false,
  communicationLevel: 'MEDIU' as const,
  stressReaction: 'CALM' as const,
  relationStyle: 'SOCIABIL' as const,
  autonomyLevel: 'PARTIAL' as const,
  sleepQuality: 'BUN' as const,
  appetiteLevel: 'NORMAL' as const,
  sadnessFrequent: false,
  anxiety: false,
  anger: false,
  apathy: false,
  hopeMotivation: false,
  observations: ''
};

export default function BeneficiarNouPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/casa-nicolae/beneficiari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          evaluationDate: new Date(form.evaluationDate)
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Eroare la salvare');
      }
      const { id } = await res.json();
      router.push(`/casa-nicolae/beneficiari/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/casa-nicolae/beneficiari"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Înapoi
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Beneficiar nou</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <h2 className="mb-4 font-semibold text-slate-200">
            A) Date de bază
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Prenume / Cod intern
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">Vârstă</label>
              <input
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={(e) =>
                  setForm((f) => ({ ...f, age: parseInt(e.target.value) || 0 }))
                }
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">Sex</label>
              <select
                value={form.sex}
                onChange={(e) => setForm((f) => ({ ...f, sex: e.target.value }))}
                className="input"
              >
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Locație / Centru
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Data evaluării
              </label>
              <input
                type="date"
                value={form.evaluationDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, evaluationDate: e.target.value }))
                }
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Persoană responsabilă
              </label>
              <input
                type="text"
                value={form.responsiblePerson}
                onChange={(e) =>
                  setForm((f) => ({ ...f, responsiblePerson: e.target.value }))
                }
                className="input"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-slate-200">
            B) Situație socială
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Are familie?
              </label>
              <select
                value={form.hasFamily}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hasFamily: e.target.value }))
                }
                className="input"
              >
                <option value="da">Da</option>
                <option value="nu">Nu</option>
                <option value="parțial">Parțial</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Stare locativă
              </label>
              <select
                value={form.housingStatus}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    housingStatus: e.target.value as typeof form.housingStatus
                  }))
                }
                className="input"
              >
                {HOUSING_OPTIONS.map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-slate-400">
                Frecvența contactului cu familia
              </label>
              <input
                type="text"
                value={form.familyContactFreq}
                onChange={(e) =>
                  setForm((f) => ({ ...f, familyContactFreq: e.target.value }))
                }
                className="input"
                placeholder="ex. săptămânal, lunar..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-slate-400">
                Istoric instituționalizare
              </label>
              <textarea
                value={form.institutionalHistory}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    institutionalHistory: e.target.value
                  }))
                }
                className="input min-h-[60px]"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-slate-200">
            C) Stare medicală (opțional, cu acord)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Boli cunoscute
              </label>
              <textarea
                value={form.knownIllnesses}
                onChange={(e) =>
                  setForm((f) => ({ ...f, knownIllnesses: e.target.value }))
                }
                className="input min-h-[60px]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Medicație
              </label>
              <textarea
                value={form.medication}
                onChange={(e) =>
                  setForm((f) => ({ ...f, medication: e.target.value }))
                }
                className="input min-h-[60px]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">
                Handicap / limitări
              </label>
              <textarea
                value={form.disabilities}
                onChange={(e) =>
                  setForm((f) => ({ ...f, disabilities: e.target.value }))
                }
                className="input min-h-[60px]"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hasPsychologicalEval}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    hasPsychologicalEval: e.target.checked
                  }))
                }
              />
              <span className="text-sm text-slate-400">
                Evaluare psihologică anterioară
              </span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-slate-200">
            D) Comportament observat
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Nivel comunicare"
              value={form.communicationLevel}
              options={COMM_OPTIONS}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  communicationLevel: v as typeof form.communicationLevel
                }))
              }
            />
            <SelectField
              label="Reacție la stres"
              value={form.stressReaction}
              options={STRESS_OPTIONS}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  stressReaction: v as typeof form.stressReaction
                }))
              }
            />
            <SelectField
              label="Relaționare"
              value={form.relationStyle}
              options={RELATION_OPTIONS}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  relationStyle: v as typeof form.relationStyle
                }))
              }
            />
            <SelectField
              label="Autonomie"
              value={form.autonomyLevel}
              options={AUTONOMY_OPTIONS}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  autonomyLevel: v as typeof form.autonomyLevel
                }))
              }
            />
            <SelectField
              label="Somn"
              value={form.sleepQuality}
              options={SLEEP_OPTIONS}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  sleepQuality: v as typeof form.sleepQuality
                }))
              }
            />
            <SelectField
              label="Apetit"
              value={form.appetiteLevel}
              options={APPETITE_OPTIONS}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  appetiteLevel: v as typeof form.appetiteLevel
                }))
              }
            />
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-slate-200">
            E) Stare emoțională (observat)
          </h2>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'sadnessFrequent', label: 'Tristețe frecventă' },
              { key: 'anxiety', label: 'Anxietate' },
              { key: 'anger', label: 'Furie' },
              { key: 'apathy', label: 'Apatie' },
              { key: 'hopeMotivation', label: 'Speranță / motivație' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.checked }))
                  }
                />
                <span className="text-sm text-slate-400">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">
            Observații
          </label>
          <textarea
            value={form.observations}
            onChange={(e) =>
              setForm((f) => ({ ...f, observations: e.target.value }))
            }
            className="input min-h-[80px]"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Se salvează...' : 'Salvează beneficiar'}
          </button>
          <Link href="/casa-nicolae/beneficiari" className="btn btn-secondary">
            Anulează
          </Link>
        </div>
      </form>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      >
        {options.map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
