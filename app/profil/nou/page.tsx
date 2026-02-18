'use client';

import AppShell from '@/components/app-shell';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import {
  ProfilBeneficiar,
  DateBaza,
  SituatieSociala,
  StareMedicala,
  ComportamentObservat,
  StareEmotionala,
  NivelComunicare,
  ReactieStres,
  Relationare,
  Autonomie,
  NivelSomn,
  NivelApetit,
  StareLocativa,
  FrecventaFamilie,
} from '@/types';
import { addProfil } from '@/lib/storage';
import { generateProfil } from '@/lib/profile-ai';

const STEPS = [
  'Date de baza',
  'Situatie sociala',
  'Stare medicala',
  'Comportament',
  'Stare emotionala',
  'Finalizare',
];

export default function ProfilNouPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [dateBaza, setDateBaza] = useState<DateBaza>({
    prenume: '',
    codIntern: '',
    varsta: '',
    sex: '',
    locatie: '',
    dataEvaluare: new Date().toISOString().split('T')[0],
    persoanaResponsabila: '',
  });

  const [situatie, setSituatie] = useState<SituatieSociala>({
    areFamilie: 'nu',
    stareLocativa: 'centru',
    frecventaContact: 'rar',
    istoricInstitutionalizare: '',
  });

  const [medical, setMedical] = useState<StareMedicala>({
    boliCunoscute: false,
    boliDetalii: '',
    medicatie: '',
    handicap: '',
    evaluarePsihologicaAnterioara: false,
  });

  const [comportament, setComportament] = useState<ComportamentObservat>({
    comunicare: 'mediu',
    reactieStres: 'calm',
    relationare: 'sociabil',
    autonomie: 'partial',
    somn: 'bun',
    apetit: 'normal',
  });

  const [emotii, setEmotii] = useState<StareEmotionala>({
    tristete: false,
    anxietate: false,
    furie: false,
    apatie: false,
    speranta: false,
  });

  const [observatii, setObservatii] = useState('');

  function canNext(): boolean {
    if (step === 0) {
      return !!(dateBaza.prenume && dateBaza.varsta && dateBaza.sex && dateBaza.locatie && dateBaza.persoanaResponsabila);
    }
    return true;
  }

  function handleSave() {
    const now = new Date().toISOString();
    const profil: ProfilBeneficiar = {
      id: crypto.randomUUID(),
      dateBaza: { ...dateBaza, varsta: Number(dateBaza.varsta) || 0 },
      situatieSociala: situatie,
      stareMedicala: medical,
      comportament,
      stareEmotionala: emotii,
      observatiiSuplimentare: observatii || undefined,
      dataCreare: now,
      dataActualizare: now,
    };

    profil.profilGenerat = generateProfil(profil);
    addProfil(profil);
    router.push(`/profil/${profil.id}`);
  }

  function toggleSection(idx: number) {
    setExpanded(expanded === idx ? null : idx);
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 pt-2 lg:pt-0">
          <Link href="/profil" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profil psihosocial nou</h1>
            <p className="text-slate-500 text-sm">Completati datele pentru a genera profilul orientativ</p>
          </div>
        </div>

        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i <= step && setStep(i)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                i === step
                  ? 'bg-brand-600 text-white'
                  : i < step
                  ? 'bg-brand-100 text-brand-700 cursor-pointer'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span className="hidden sm:inline">{s}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        <div className="card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">A) Date de baza</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Prenume *</label>
                  <input
                    type="text"
                    className="input"
                    value={dateBaza.prenume}
                    onChange={(e) => setDateBaza({ ...dateBaza, prenume: e.target.value })}
                    placeholder="Prenumele beneficiarului"
                  />
                </div>
                <div>
                  <label className="label">Cod intern (optional)</label>
                  <input
                    type="text"
                    className="input"
                    value={dateBaza.codIntern}
                    onChange={(e) => setDateBaza({ ...dateBaza, codIntern: e.target.value })}
                    placeholder="ex: BN-001"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Varsta *</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    className="input"
                    value={dateBaza.varsta}
                    onChange={(e) => setDateBaza({ ...dateBaza, varsta: e.target.value ? Number(e.target.value) : '' })}
                    placeholder="Ani"
                  />
                </div>
                <div>
                  <label className="label">Sex *</label>
                  <select
                    className="select"
                    value={dateBaza.sex}
                    onChange={(e) => setDateBaza({ ...dateBaza, sex: e.target.value as 'M' | 'F' | '' })}
                  >
                    <option value="">Selectati</option>
                    <option value="M">Masculin</option>
                    <option value="F">Feminin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Data evaluare</label>
                  <input
                    type="date"
                    className="input"
                    value={dateBaza.dataEvaluare}
                    onChange={(e) => setDateBaza({ ...dateBaza, dataEvaluare: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Locatie / Centru *</label>
                <input
                  type="text"
                  className="input"
                  value={dateBaza.locatie}
                  onChange={(e) => setDateBaza({ ...dateBaza, locatie: e.target.value })}
                  placeholder="ex: Casa Nicolae - Centrul 1"
                />
              </div>

              <div>
                <label className="label">Persoana responsabila *</label>
                <input
                  type="text"
                  className="input"
                  value={dateBaza.persoanaResponsabila}
                  onChange={(e) => setDateBaza({ ...dateBaza, persoanaResponsabila: e.target.value })}
                  placeholder="Numele evaluatorului"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">B) Situatie sociala</h2>

              <div>
                <label className="label">Are familie?</label>
                <div className="flex gap-3">
                  {(['da', 'nu', 'partial'] as const).map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="familie"
                        checked={situatie.areFamilie === v}
                        onChange={() => setSituatie({ ...situatie, areFamilie: v })}
                        className="accent-brand-600"
                      />
                      <span className="text-sm capitalize">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Stare locativa</label>
                <select
                  className="select"
                  value={situatie.stareLocativa}
                  onChange={(e) => setSituatie({ ...situatie, stareLocativa: e.target.value as StareLocativa })}
                >
                  <option value="fara_adapost">Fara adapost</option>
                  <option value="centru">In centru rezidential</option>
                  <option value="familie">In familie</option>
                </select>
              </div>

              <div>
                <label className="label">Frecventa contact cu familia</label>
                <select
                  className="select"
                  value={situatie.frecventaContact}
                  onChange={(e) => setSituatie({ ...situatie, frecventaContact: e.target.value as FrecventaFamilie })}
                >
                  <option value="zilnic">Zilnic</option>
                  <option value="saptamanal">Saptamanal</option>
                  <option value="lunar">Lunar</option>
                  <option value="rar">Rar</option>
                  <option value="niciodata">Fara contact</option>
                </select>
              </div>

              <div>
                <label className="label">Istoric institutionalizare</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={situatie.istoricInstitutionalizare}
                  onChange={(e) => setSituatie({ ...situatie, istoricInstitutionalizare: e.target.value })}
                  placeholder="Detalii despre istoric (optional)"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">C) Stare medicala</h2>
              <p className="text-sm text-slate-500">Optional - doar cu acord</p>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medical.boliCunoscute}
                    onChange={(e) => setMedical({ ...medical, boliCunoscute: e.target.checked })}
                    className="accent-brand-600 w-4 h-4"
                  />
                  <span className="text-sm">Boli cunoscute</span>
                </label>
              </div>

              {medical.boliCunoscute && (
                <div>
                  <label className="label">Detalii boli</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    value={medical.boliDetalii}
                    onChange={(e) => setMedical({ ...medical, boliDetalii: e.target.value })}
                    placeholder="ex: diabet tip 2, hipertensiune..."
                  />
                </div>
              )}

              <div>
                <label className="label">Medicatie curenta</label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={medical.medicatie}
                  onChange={(e) => setMedical({ ...medical, medicatie: e.target.value })}
                  placeholder="Lista medicamentelor (optional)"
                />
              </div>

              <div>
                <label className="label">Handicap / Limitari</label>
                <input
                  type="text"
                  className="input"
                  value={medical.handicap}
                  onChange={(e) => setMedical({ ...medical, handicap: e.target.value })}
                  placeholder="ex: handicap locomotor grad II"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medical.evaluarePsihologicaAnterioara}
                    onChange={(e) => setMedical({ ...medical, evaluarePsihologicaAnterioara: e.target.checked })}
                    className="accent-brand-600 w-4 h-4"
                  />
                  <span className="text-sm">Evaluare psihologica anterioara</span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-900">D) Comportament observat</h2>

              <ScaleField
                label="Nivel de comunicare"
                options={[
                  { value: 'mic', label: 'Redus' },
                  { value: 'mediu', label: 'Mediu' },
                  { value: 'bun', label: 'Bun' },
                ]}
                value={comportament.comunicare}
                onChange={(v) => setComportament({ ...comportament, comunicare: v as NivelComunicare })}
              />

              <ScaleField
                label="Reactie la stres"
                options={[
                  { value: 'calm', label: 'Calm' },
                  { value: 'agitat', label: 'Agitat' },
                  { value: 'crize', label: 'Crize' },
                ]}
                value={comportament.reactieStres}
                onChange={(v) => setComportament({ ...comportament, reactieStres: v as ReactieStres })}
              />

              <ScaleField
                label="Relationare"
                options={[
                  { value: 'retras', label: 'Retras' },
                  { value: 'sociabil', label: 'Sociabil' },
                  { value: 'agresiv', label: 'Agresiv' },
                ]}
                value={comportament.relationare}
                onChange={(v) => setComportament({ ...comportament, relationare: v as Relationare })}
              />

              <ScaleField
                label="Autonomie"
                options={[
                  { value: 'dependent', label: 'Dependent' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'independent', label: 'Independent' },
                ]}
                value={comportament.autonomie}
                onChange={(v) => setComportament({ ...comportament, autonomie: v as Autonomie })}
              />

              <ScaleField
                label="Somn"
                options={[
                  { value: 'bun', label: 'Bun' },
                  { value: 'slab', label: 'Slab' },
                ]}
                value={comportament.somn}
                onChange={(v) => setComportament({ ...comportament, somn: v as NivelSomn })}
              />

              <ScaleField
                label="Apetit"
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'scazut', label: 'Scazut' },
                ]}
                value={comportament.apetit}
                onChange={(v) => setComportament({ ...comportament, apetit: v as NivelApetit })}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">E) Stare emotionala</h2>
              <p className="text-sm text-slate-500">Observat de personal sau auto-raportat</p>

              <div className="space-y-3">
                {([
                  { key: 'tristete', label: 'Tristete frecventa' },
                  { key: 'anxietate', label: 'Anxietate' },
                  { key: 'furie', label: 'Furie / Iritabilitate' },
                  { key: 'apatie', label: 'Apatie / Lipsa de interes' },
                  { key: 'speranta', label: 'Speranta / Motivatie' },
                ] as const).map((item) => (
                  <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={emotii[item.key]}
                      onChange={(e) => setEmotii({ ...emotii, [item.key]: e.target.checked })}
                      className="accent-brand-600 w-4 h-4"
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Finalizare</h2>
              <p className="text-sm text-slate-500">
                Verificati datele introduse si adaugati observatii suplimentare daca este necesar.
              </p>

              <div className="space-y-2">
                <SummarySection
                  title="Date de baza"
                  index={0}
                  expanded={expanded}
                  onToggle={toggleSection}
                >
                  <p><strong>Prenume:</strong> {dateBaza.prenume}</p>
                  {dateBaza.codIntern && <p><strong>Cod:</strong> {dateBaza.codIntern}</p>}
                  <p><strong>Varsta:</strong> {dateBaza.varsta} ani</p>
                  <p><strong>Sex:</strong> {dateBaza.sex === 'M' ? 'Masculin' : 'Feminin'}</p>
                  <p><strong>Locatie:</strong> {dateBaza.locatie}</p>
                  <p><strong>Responsabil:</strong> {dateBaza.persoanaResponsabila}</p>
                </SummarySection>

                <SummarySection
                  title="Situatie sociala"
                  index={1}
                  expanded={expanded}
                  onToggle={toggleSection}
                >
                  <p><strong>Familie:</strong> {situatie.areFamilie}</p>
                  <p><strong>Locativa:</strong> {situatie.stareLocativa.replace('_', ' ')}</p>
                  <p><strong>Contact:</strong> {situatie.frecventaContact}</p>
                </SummarySection>

                <SummarySection
                  title="Stare medicala"
                  index={2}
                  expanded={expanded}
                  onToggle={toggleSection}
                >
                  <p><strong>Boli:</strong> {medical.boliCunoscute ? `Da - ${medical.boliDetalii}` : 'Nu'}</p>
                  <p><strong>Medicatie:</strong> {medical.medicatie || 'Niciuna'}</p>
                  <p><strong>Handicap:</strong> {medical.handicap || 'Nu'}</p>
                </SummarySection>

                <SummarySection
                  title="Comportament"
                  index={3}
                  expanded={expanded}
                  onToggle={toggleSection}
                >
                  <p><strong>Comunicare:</strong> {comportament.comunicare}</p>
                  <p><strong>Stres:</strong> {comportament.reactieStres}</p>
                  <p><strong>Relationare:</strong> {comportament.relationare}</p>
                  <p><strong>Autonomie:</strong> {comportament.autonomie}</p>
                  <p><strong>Somn:</strong> {comportament.somn}</p>
                  <p><strong>Apetit:</strong> {comportament.apetit}</p>
                </SummarySection>

                <SummarySection
                  title="Stare emotionala"
                  index={4}
                  expanded={expanded}
                  onToggle={toggleSection}
                >
                  <p>{emotii.tristete ? '* Tristete' : ''}</p>
                  <p>{emotii.anxietate ? '* Anxietate' : ''}</p>
                  <p>{emotii.furie ? '* Furie' : ''}</p>
                  <p>{emotii.apatie ? '* Apatie' : ''}</p>
                  <p>{emotii.speranta ? '* Speranta / Motivatie' : ''}</p>
                  {!emotii.tristete && !emotii.anxietate && !emotii.furie && !emotii.apatie && !emotii.speranta && (
                    <p className="text-slate-400">Nicio stare selectata</p>
                  )}
                </SummarySection>
              </div>

              <div>
                <label className="label">Observatii suplimentare (optional)</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={observatii}
                  onChange={(e) => setObservatii(e.target.value)}
                  placeholder="Orice informatie suplimentara relevanta..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-slate-200 mt-6">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              className="btn btn-secondary"
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4" /> Inapoi
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
                disabled={!canNext()}
              >
                Urmatorul <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSave} className="btn btn-primary">
                <Save className="w-4 h-4" /> Genereaza profil
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ScaleField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition ${
              value === opt.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummarySection({
  title,
  index,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  index: number;
  expanded: number | null;
  onToggle: (idx: number) => void;
  children: React.ReactNode;
}) {
  const isOpen = expanded === index;
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between p-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 text-sm text-slate-600 space-y-0.5">{children}</div>
      )}
    </div>
  );
}
