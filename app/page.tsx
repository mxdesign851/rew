'use client';

import AppShell from '@/components/app-shell';
import Link from 'next/link';
import { Pill, Users, AlertTriangle, Clock, TrendingUp, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMedicamente, getProfile, getMedicamenteLowStock, getMedicamenteExpirate } from '@/lib/storage';

export default function HubPage() {
  const [stats, setStats] = useState({
    totalMedicamente: 0,
    lowStock: 0,
    expirate: 0,
    totalProfile: 0,
  });

  useEffect(() => {
    const meds = getMedicamente();
    const profiles = getProfile();
    setStats({
      totalMedicamente: meds.length,
      lowStock: getMedicamenteLowStock().length,
      expirate: getMedicamenteExpirate().length,
      totalProfile: profiles.length,
    });
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="pt-2 lg:pt-0">
          <h1 className="text-2xl font-bold text-slate-900">Hub Principal</h1>
          <p className="text-slate-500 mt-1">Casa Nicolae &mdash; Aplicatie interna de gestionare</p>
        </div>

        {(stats.lowStock > 0 || stats.expirate > 0) && (
          <div className="card border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Notificari importante</h3>
                <ul className="mt-1 space-y-1 text-sm text-amber-700">
                  {stats.lowStock > 0 && (
                    <li>{stats.lowStock} medicament{stats.lowStock > 1 ? 'e' : ''} cu stoc scazut</li>
                  )}
                  {stats.expirate > 0 && (
                    <li>{stats.expirate} medicament{stats.expirate > 1 ? 'e' : ''} expirate sau aproape de expirare</li>
                  )}
                </ul>
                <Link
                  href="/medicamente"
                  className="inline-block mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
                >
                  Vezi detalii &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Pill className="w-5 h-5" />}
            label="Medicamente"
            value={stats.totalMedicamente}
            color="blue"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Stoc scazut"
            value={stats.lowStock}
            color={stats.lowStock > 0 ? 'red' : 'green'}
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Profile"
            value={stats.totalProfile}
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Expirate"
            value={stats.expirate}
            color={stats.expirate > 0 ? 'red' : 'green'}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/medicamente" className="card p-6 hover:shadow-md transition group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand-100 text-brand-700 group-hover:bg-brand-200 transition">
                <Pill className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700 transition">
                  Gestiune Medicamente
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Categorii, stocuri, preturi, notificari si liste PDF de cumparaturi
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Cardio', 'Diabet', 'Neuro', 'Vitamine', '+7'].map((tag) => (
                <span key={tag} className="badge badge-blue">{tag}</span>
              ))}
            </div>
          </Link>

          <Link href="/profil" className="card p-6 hover:shadow-md transition group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                  Profile Psihosociale
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Evaluare orientativa, fise pentru dosar, recomandari pentru personal
                </p>
              </div>
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Profil orientativ', 'Recomandari', 'Plan sprijin', 'PDF'].map((tag) => (
                <span key={tag} className="badge badge-green">{tag}</span>
              ))}
            </div>
          </Link>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Despre aplicatie</h3>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              Aceasta aplicatie este un instrument intern pentru personalul Casei Nicolae.
              Datele introduse sunt confidentiale si nu parasesc acest dispozitiv.
            </p>
            <p>
              <strong>Modulul Medicamente:</strong> Gestioneaza stocul de medicamente pe categorii,
              primeste notificari cand stocul este scazut, exporta liste PDF pentru cumparaturi.
            </p>
            <p>
              <strong>Modulul Profile Psihosociale:</strong> Genereaza profiluri orientative de sprijin
              pentru beneficiari. <em>NU pune diagnostice</em> &mdash; ofera doar ghidaj orientativ
              pentru personalul de ingrijire.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-brand-50 text-brand-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-emerald-50 text-emerald-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="card p-4">
      <div className={`inline-flex p-2 rounded-lg ${colorMap[color] || colorMap.blue} mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
