'use client';

import AppShell from '@/components/app-shell';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Eye, Users, Download } from 'lucide-react';
import { ProfilBeneficiar } from '@/types';
import { getProfile, deleteProfil } from '@/lib/storage';
import { generateProfilPDF } from '@/lib/pdf-profil';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfilBeneficiar[]>([]);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function handleDelete(id: string) {
    if (confirm('Sigur doriti sa stergeti acest profil?')) {
      const updated = deleteProfil(id);
      setProfile(updated);
    }
  }

  function handleExportPDF(profil: ProfilBeneficiar) {
    if (!profil.profilGenerat) {
      alert('Profilul nu a fost inca generat. Deschideti profilul si generati-l mai intai.');
      return;
    }
    generateProfilPDF(profil);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 lg:pt-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profile Psihosociale</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Profile orientative de sprijin pentru beneficiari
            </p>
          </div>
          <Link href="/profil/nou" className="btn btn-primary">
            <Plus className="w-4 h-4" /> Profil nou
          </Link>
        </div>

        <div className="card border-brand-200 bg-brand-50 p-4">
          <p className="text-sm text-brand-800">
            <strong>Important:</strong> Aceste profile sunt orientative si NU constituie diagnostice medicale sau psihologice.
            Scopul lor este sa ofere ghidaj pentru personalul de ingrijire.
          </p>
        </div>

        {profile.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">
              Niciun profil creat inca.
            </p>
            <Link href="/profil/nou" className="btn btn-primary">
              <Plus className="w-4 h-4" /> Creeaza primul profil
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {profile.map((p) => (
              <div key={p.id} className="card p-5 hover:shadow-md transition">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {p.dateBaza.prenume}
                        {p.dateBaza.codIntern && (
                          <span className="text-slate-400 font-normal text-sm ml-2">({p.dateBaza.codIntern})</span>
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                        <span>{p.dateBaza.varsta} ani</span>
                        <span>{p.dateBaza.sex === 'M' ? 'Masculin' : 'Feminin'}</span>
                        <span>{p.dateBaza.locatie}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                        <span>Evaluat: {formatDate(p.dateBaza.dataEvaluare)}</span>
                        <span>De: {p.dateBaza.persoanaResponsabila}</span>
                      </div>
                      {p.profilGenerat && (
                        <span className="badge badge-green mt-2 text-[10px]">Profil generat</span>
                      )}
                      {!p.profilGenerat && (
                        <span className="badge badge-yellow mt-2 text-[10px]">Profil in asteptare</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/profil/${p.id}`}
                      className="btn btn-secondary text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Deschide
                    </Link>
                    {p.profilGenerat && (
                      <button
                        onClick={() => handleExportPDF(p)}
                        className="btn btn-secondary text-xs"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-secondary text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('ro-RO');
  } catch {
    return iso;
  }
}
