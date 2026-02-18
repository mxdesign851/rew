'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MEDICATION_CATEGORIES } from '@/lib/casa-nicolae';

export default function AdaugaMedicamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    categoryType: 'CARDIO',
    quantity: 10,
    minQuantity: 5,
    unit: 'buc',
    notes: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/casa-nicolae/medicament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Eroare la salvare');
      }
      router.push('/casa-nicolae/medicament');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/casa-nicolae/medicament"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Înapoi
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Adaugă medicament</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-slate-400">Categorie</label>
          <select
            value={form.categoryType}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoryType: e.target.value }))
            }
            className="input"
            required
          >
            {MEDICATION_CATEGORIES.map((c) => (
              <option key={c.type} value={c.type}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">
            Nume medicament
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input"
            placeholder="ex. Paracetamol"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Cantitate
            </label>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: parseInt(e.target.value) || 0 }))
              }
              className="input"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Cantitate minimă (alertă)
            </label>
            <input
              type="number"
              min={0}
              value={form.minQuantity}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  minQuantity: parseInt(e.target.value) || 0
                }))
              }
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Unitate</label>
          <select
            value={form.unit}
            onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            className="input"
          >
            <option value="buc">buc</option>
            <option value="cutie">cutie</option>
            <option value="flacon">flacon</option>
            <option value="mg">mg</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Notițe</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="input min-h-[80px]"
            placeholder="Opțional"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Se salvează...' : 'Salvează'}
          </button>
          <Link href="/casa-nicolae/medicament" className="btn btn-secondary">
            Anulează
          </Link>
        </div>
      </form>
    </div>
  );
}
