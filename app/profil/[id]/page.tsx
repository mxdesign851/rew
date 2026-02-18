'use client';

import AppShell from '@/components/app-shell';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  User,
  Heart,
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Lightbulb,
} from 'lucide-react';
import { ProfilBeneficiar } from '@/types';
import { getProfilById, updateProfil } from '@/lib/storage';
import { generateProfil } from '@/lib/profile-ai';
import { generateProfilPDF } from '@/lib/pdf-profil';

export default function ProfilDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [profil, setProfil] = useState<ProfilBeneficiar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getProfilById(id);
    setProfil(p || null);
    setLoading(false);
  }, [id]);

  function handleRegenerate() {
    if (!profil) return;
    const newGen = generateProfil(profil);
    const updated = { ...profil, profilGenerat: newGen, dataActualizare: new Date().toISOString() };
    updateProfil(profil.id, { profilGenerat: newGen });
    setProfil(updated);
  }

  function handleExportPDF() {
    if (!profil?.profilGenerat) return;
    generateProfilPDF(profil);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full" />
        </div>
      </AppShell>
    );
  }

  if (!profil) {
    return (
      <AppShell>
        <div className="card p-12 text-center">
          <p className="text-slate-500 mb-4">Profilul nu a fost gasit.</p>
          <Link href="/profil" className="btn btn-primary">Inapoi la profile</Link>
        </div>
      </AppShell>
    );
  }

  const gen = profil.profilGenerat;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 lg:pt-0">
          <div className="flex items-center gap-4">
            <Link href="/profil" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {profil.dateBaza.prenume}
                {profil.dateBaza.codIntern && (
                  <span className="text-slate-400 font-normal text-lg ml-2">({profil.dateBaza.codIntern})</span>
                )}
              </h1>
              <p className="text-slate-500 text-sm">
                {profil.dateBaza.varsta} ani &bull; {profil.dateBaza.sex === 'M' ? 'Masculin' : 'Feminin'} &bull; {profil.dateBaza.locatie}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleRegenerate} className="btn btn-secondary">
              <RefreshCw className="w-4 h-4" /> Regenereaza
            </button>
            {gen && (
              <button onClick={handleExportPDF} className="btn btn-primary">
                <Download className="w-4 h-4" /> Descarca PDF
              </button>
            )}
          </div>
        </div>

        <div className="card border-brand-200 bg-brand-50 p-3">
          <p className="text-xs text-brand-800">
            Document orientativ - NU constituie diagnostic medical sau psihologic.
            Scopul este de a oferi ghidaj pentru personalul de ingrijire.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Date evaluare" icon={<User className="w-4 h-4" />}>
            <InfoRow label="Data evaluare" value={formatDate(profil.dateBaza.dataEvaluare)} />
            <InfoRow label="Responsabil" value={profil.dateBaza.persoanaResponsabila} />
            <InfoRow label="Locatie" value={profil.dateBaza.locatie} />
          </InfoCard>

          <InfoCard title="Situatie sociala" icon={<Heart className="w-4 h-4" />}>
            <InfoRow label="Familie" value={profil.situatieSociala.areFamilie} />
            <InfoRow label="Stare locativa" value={profil.situatieSociala.stareLocativa.replace('_', ' ')} />
            <InfoRow label="Contact familie" value={profil.situatieSociala.frecventaContact} />
          </InfoCard>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <BehaviorBadge label="Comunicare" value={profil.comportament.comunicare} />
          <BehaviorBadge label="Stres" value={profil.comportament.reactieStres} />
          <BehaviorBadge label="Relationare" value={profil.comportament.relationare} />
          <BehaviorBadge label="Autonomie" value={profil.comportament.autonomie} />
          <BehaviorBadge label="Somn" value={profil.comportament.somn} />
          <BehaviorBadge label="Apetit" value={profil.comportament.apetit} />
        </div>

        {gen && (
          <>
            <div className="card p-5 space-y-4">
              <SectionHeader icon={<User className="w-4 h-4" />} title="1. Context personal" />
              <p className="text-sm text-slate-700 leading-relaxed">{gen.contextPersonal}</p>
            </div>

            <div className="card p-5 space-y-4">
              <SectionHeader icon={<Heart className="w-4 h-4" />} title="2. Profil emotional si comportamental" />
              <p className="text-sm text-slate-700 leading-relaxed">{gen.profilEmotional}</p>
            </div>

            <div className="card p-5 space-y-4">
              <SectionHeader icon={<ClipboardList className="w-4 h-4" />} title="3. Nevoi principale" />
              <ul className="space-y-2">
                {gen.nevoiPrincipale.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 space-y-4 border-amber-200 bg-amber-50/30">
              <SectionHeader icon={<AlertTriangle className="w-4 h-4 text-amber-600" />} title="4. Riscuri identificate" />
              <ul className="space-y-2">
                {gen.riscuri.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 space-y-4 border-emerald-200 bg-emerald-50/30">
              <SectionHeader icon={<Lightbulb className="w-4 h-4 text-emerald-600" />} title="5. Recomandari pentru personal" />
              <ul className="space-y-2">
                {gen.recomandariPersonal.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 space-y-4 border-brand-200 bg-brand-50/30">
              <SectionHeader icon={<ClipboardList className="w-4 h-4 text-brand-600" />} title="6. Plan de sprijin" />
              <ul className="space-y-2">
                {gen.planSprijin.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {profil.observatiiSuplimentare && (
              <div className="card p-5">
                <h3 className="font-semibold text-slate-900 mb-2">Observatii suplimentare</h3>
                <p className="text-sm text-slate-700">{profil.observatiiSuplimentare}</p>
              </div>
            )}

            <div className="card p-4 text-center text-xs text-slate-400">
              Profil generat: {formatDate(gen.dataGenerare)} &bull; Ultima actualizare: {formatDate(profil.dataActualizare)}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-brand-600">{icon}</div>
        <h3 className="font-semibold text-sm text-slate-900">{title}</h3>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium capitalize">{value}</span>
    </div>
  );
}

function BehaviorBadge({ label, value }: { label: string; value: string }) {
  const colorMap: Record<string, string> = {
    bun: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    normal: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    calm: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sociabil: 'bg-brand-100 text-brand-800 border-brand-200',
    independent: 'bg-brand-100 text-brand-800 border-brand-200',
    mediu: 'bg-amber-100 text-amber-800 border-amber-200',
    partial: 'bg-amber-100 text-amber-800 border-amber-200',
    slab: 'bg-red-100 text-red-800 border-red-200',
    scazut: 'bg-red-100 text-red-800 border-red-200',
    agitat: 'bg-amber-100 text-amber-800 border-amber-200',
    crize: 'bg-red-100 text-red-800 border-red-200',
    retras: 'bg-amber-100 text-amber-800 border-amber-200',
    agresiv: 'bg-red-100 text-red-800 border-red-200',
    dependent: 'bg-red-100 text-red-800 border-red-200',
    mic: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className={`rounded-lg border p-3 text-center ${colorMap[value] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      <p className="text-[10px] uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-sm font-semibold capitalize mt-0.5">{value}</p>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}
