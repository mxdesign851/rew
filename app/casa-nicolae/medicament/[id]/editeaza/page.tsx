'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { MEDICATION_CATEGORIES } from '@/lib/casa-nicolae';

export default function EditeazaMedicamentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    categoryType: 'CARDIO',
    quantity: 0,
    minQuantity: 5,
    unit: 'buc',
    notes: ''
  });

  useEffect(() => {
    fetch(`/api/casa-nicolae/medicament/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForm({
          name: data.name,
          categoryType: data.category?.type ?? 'CARDIO',
          quantity: data.quantity ?? 0,
          minQuantity: data.minQuantity ?? 5,
          unit: data.unit ?? 'buc',
          notes: data.notes ?? ''
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/casa-nicolae/medicament/${id}`, {
        method: 'PATCH',
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
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-400">Se încarcă...</p>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-slate-100">Editează medicament</h1>
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
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Cantitate</label>
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
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Se salvează...' : 'Salvează'}
          </button>
          <Link href="/casa-nicolae/medicament" className="btn btn-secondary">
            Anulează
          </Link>
        </div>
      </form>
    </div>
  );
}
