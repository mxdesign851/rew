'use client';

import AppShell from '@/components/app-shell';
import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Download,
  ShoppingCart,
  Trash2,
  Edit3,
  X,
  AlertTriangle,
  Heart,
  Droplets,
  Wind,
  Brain,
  Smile,
  Shield,
  Zap,
  Flower2,
  Sparkles,
  Layers,
  Package,
} from 'lucide-react';
import { Medicament, CategorieMedicament } from '@/types';
import {
  getMedicamente,
  addMedicament,
  updateMedicament,
  deleteMedicament,
} from '@/lib/storage';
import { generateMedicamentePDF, generateListaCumparaturi } from '@/lib/pdf-medicamente';

const CATEGORII: { key: CategorieMedicament; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'cardio', label: 'Cardio', icon: <Heart className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
  { key: 'diabet', label: 'Diabet', icon: <Droplets className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
  { key: 'gastro', label: 'Gastro', icon: <Layers className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' },
  { key: 'respirator', label: 'Respirator', icon: <Wind className="w-4 h-4" />, color: 'bg-cyan-100 text-cyan-700' },
  { key: 'neuro', label: 'Neuro', icon: <Brain className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
  { key: 'psihiatric', label: 'Psihiatric', icon: <Smile className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-700' },
  { key: 'antibiotice', label: 'Antibiotice', icon: <Shield className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700' },
  { key: 'durere', label: 'Durere', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700' },
  { key: 'alergii', label: 'Alergii', icon: <Flower2 className="w-4 h-4" />, color: 'bg-pink-100 text-pink-700' },
  { key: 'dermato', label: 'Dermato', icon: <Sparkles className="w-4 h-4" />, color: 'bg-rose-100 text-rose-700' },
  { key: 'vitamine', label: 'Vitamine', icon: <Sparkles className="w-4 h-4" />, color: 'bg-lime-100 text-lime-700' },
  { key: 'altele', label: 'Altele', icon: <Package className="w-4 h-4" />, color: 'bg-slate-100 text-slate-700' },
];

const EMPTY_MED: Omit<Medicament, 'id' | 'dataAdaugare' | 'dataActualizare'> = {
  nume: '',
  categorie: 'cardio',
  stoc: 0,
  stocMinim: 5,
  pret: 0,
  dataExpirare: '',
  furnizor: '',
  note: '',
};

export default function MedicamentePage() {
  const [medicamente, setMedicamente] = useState<Medicament[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<CategorieMedicament | 'toate'>('toate');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_MED);
  const [showLowOnly, setShowLowOnly] = useState(false);

  useEffect(() => {
    setMedicamente(getMedicamente());
  }, []);

  const filtered = useMemo(() => {
    let list = medicamente;
    if (filterCat !== 'toate') list = list.filter((m) => m.categorie === filterCat);
    if (showLowOnly) list = list.filter((m) => m.stoc <= m.stocMinim);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.nume.toLowerCase().includes(q) ||
          m.furnizor?.toLowerCase().includes(q) ||
          m.categorie.toLowerCase().includes(q)
      );
    }
    return list;
  }, [medicamente, filterCat, showLowOnly, search]);

  const lowStockCount = medicamente.filter((m) => m.stoc <= m.stocMinim).length;

  function openAdd() {
    setForm(EMPTY_MED);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(med: Medicament) {
    setForm({
      nume: med.nume,
      categorie: med.categorie,
      stoc: med.stoc,
      stocMinim: med.stocMinim,
      pret: med.pret,
      dataExpirare: med.dataExpirare || '',
      furnizor: med.furnizor || '',
      note: med.note || '',
    });
    setEditId(med.id);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.nume.trim()) return;
    if (editId) {
      const updated = updateMedicament(editId, form);
      setMedicamente(updated);
    } else {
      const now = new Date().toISOString();
      const newMed: Medicament = {
        ...form,
        id: crypto.randomUUID(),
        dataAdaugare: now,
        dataActualizare: now,
      };
      const updated = addMedicament(newMed);
      setMedicamente(updated);
    }
    setShowForm(false);
    setEditId(null);
  }

  function handleDelete(id: string) {
    if (confirm('Sigur doriti sa stergeti acest medicament?')) {
      const updated = deleteMedicament(id);
      setMedicamente(updated);
    }
  }

  function exportAll() {
    generateMedicamentePDF(filtered, 'LISTA COMPLETA MEDICAMENTE');
  }

  function exportCumparaturi() {
    generateListaCumparaturi(medicamente);
  }

  const catInfo = (key: CategorieMedicament) => CATEGORII.find((c) => c.key === key);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 lg:pt-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestiune Medicamente</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {medicamente.length} medicamente &bull; {CATEGORII.length} categorii
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportAll} className="btn btn-secondary" disabled={filtered.length === 0}>
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={exportCumparaturi} className="btn btn-secondary" disabled={lowStockCount === 0}>
              <ShoppingCart className="w-4 h-4" /> Lista cumparaturi
            </button>
            <button onClick={openAdd} className="btn btn-primary">
              <Plus className="w-4 h-4" /> Adauga
            </button>
          </div>
        </div>

        {lowStockCount > 0 && (
          <div className="card border-amber-200 bg-amber-50 p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>{lowStockCount}</strong> medicament{lowStockCount > 1 ? 'e' : ''} au stocul sub minimul stabilit.{' '}
              <button
                onClick={() => { setShowLowOnly(!showLowOnly); setFilterCat('toate'); }}
                className="underline font-medium"
              >
                {showLowOnly ? 'Arata toate' : 'Arata doar cu stoc scazut'}
              </button>
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setFilterCat('toate'); setShowLowOnly(false); }}
            className={`badge cursor-pointer transition ${filterCat === 'toate' && !showLowOnly ? 'badge-blue' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Toate
          </button>
          {CATEGORII.map((cat) => {
            const count = medicamente.filter((m) => m.categorie === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => { setFilterCat(cat.key); setShowLowOnly(false); }}
                className={`badge cursor-pointer transition flex items-center gap-1 ${
                  filterCat === cat.key ? cat.color : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.icon} {cat.label}
                {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cauta medicament, furnizor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              {medicamente.length === 0
                ? 'Niciun medicament adaugat inca. Apasati "Adauga" pentru a incepe.'
                : 'Niciun medicament gasit cu filtrele selectate.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((med) => {
              const cat = catInfo(med.categorie);
              const isLow = med.stoc <= med.stocMinim;
              const isExpired = med.dataExpirare && med.dataExpirare <= new Date().toISOString().split('T')[0];

              return (
                <div
                  key={med.id}
                  className={`card p-4 flex flex-wrap items-center gap-4 ${isLow ? 'border-amber-300 bg-amber-50/50' : ''}`}
                >
                  <div className={`p-2 rounded-lg ${cat?.color || 'bg-slate-100 text-slate-600'}`}>
                    {cat?.icon || <Package className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <p className="font-semibold text-slate-900">{med.nume}</p>
                    <p className="text-xs text-slate-500">
                      {cat?.label || med.categorie}
                      {med.furnizor && ` \u2022 ${med.furnizor}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className={`font-bold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>
                        {med.stoc}
                      </p>
                      <p className="text-[10px] text-slate-400">stoc</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-600">{med.stocMinim}</p>
                      <p className="text-[10px] text-slate-400">minim</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-slate-600">
                        {med.pret ? `${med.pret.toFixed(2)} lei` : '-'}
                      </p>
                      <p className="text-[10px] text-slate-400">pret</p>
                    </div>
                    {med.dataExpirare && (
                      <div className="text-center">
                        <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-slate-600'}`}>
                          {new Date(med.dataExpirare).toLocaleDateString('ro-RO')}
                        </p>
                        <p className="text-[10px] text-slate-400">expirare</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {isLow && (
                      <span className="badge badge-red text-[10px]">Stoc scazut</span>
                    )}
                    {isExpired && (
                      <span className="badge badge-red text-[10px]">Expirat</span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(med)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
                      title="Editare"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                      title="Sterge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editId ? 'Editeaza medicament' : 'Adauga medicament'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="label">Nume medicament *</label>
                  <input
                    type="text"
                    className="input"
                    value={form.nume}
                    onChange={(e) => setForm({ ...form, nume: e.target.value })}
                    placeholder="ex: Metformin 500mg"
                  />
                </div>

                <div>
                  <label className="label">Categorie</label>
                  <select
                    className="select"
                    value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value as CategorieMedicament })}
                  >
                    {CATEGORII.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Stoc actual</label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      value={form.stoc}
                      onChange={(e) => setForm({ ...form, stoc: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Stoc minim (alerta)</label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      value={form.stocMinim}
                      onChange={(e) => setForm({ ...form, stocMinim: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Pret (RON)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input"
                      value={form.pret}
                      onChange={(e) => setForm({ ...form, pret: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Data expirare</label>
                    <input
                      type="date"
                      className="input"
                      value={form.dataExpirare}
                      onChange={(e) => setForm({ ...form, dataExpirare: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Furnizor</label>
                  <input
                    type="text"
                    className="input"
                    value={form.furnizor}
                    onChange={(e) => setForm({ ...form, furnizor: e.target.value })}
                    placeholder="ex: Farmacia X"
                  />
                </div>

                <div>
                  <label className="label">Note</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Observatii..."
                  />
                </div>
              </div>

              <div className="flex gap-3 p-4 border-t border-slate-200">
                <button onClick={() => setShowForm(false)} className="btn btn-secondary flex-1">
                  Anuleaza
                </button>
                <button onClick={handleSave} className="btn btn-primary flex-1" disabled={!form.nume.trim()}>
                  {editId ? 'Salveaza' : 'Adauga'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
