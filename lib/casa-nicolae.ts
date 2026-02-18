import { MedicationCategoryType } from '@prisma/client';

export const MEDICATION_CATEGORIES: { type: MedicationCategoryType; name: string }[] = [
  { type: 'CARDIO', name: 'Cardio' },
  { type: 'DIABET', name: 'Diabet' },
  { type: 'GASTRO', name: 'Gastro' },
  { type: 'RESPIRATOR', name: 'Respirator' },
  { type: 'NEURO', name: 'Neuro' },
  { type: 'PSIHIATRIC', name: 'Psihiatric' },
  { type: 'ANTIBIOTICE', name: 'Antibiotice' },
  { type: 'DURERE', name: 'Durere' },
  { type: 'ALERGII', name: 'Alergii' },
  { type: 'DERMATO', name: 'Dermato' },
  { type: 'VITAMINE', name: 'Vitamine' },
  { type: 'ALTELE', name: 'Altele' }
];

export const HOUSING_LABELS: Record<string, string> = {
  FARA_ADAPOST: 'Fără adăpost',
  CENTRU: 'Centru',
  FAMILIE: 'Familie'
};

export const COMMUNICATION_LABELS: Record<string, string> = {
  MIC: 'Mic',
  MEDIU: 'Mediu',
  BUN: 'Bun'
};

export const STRESS_LABELS: Record<string, string> = {
  CALM: 'Calm',
  AGITAT: 'Agitat',
  CRIZE: 'Crize'
};

export const RELATION_LABELS: Record<string, string> = {
  RETRAS: 'Retras',
  SOCIABIL: 'Sociabil',
  AGRESIV: 'Agresiv'
};

export const AUTONOMY_LABELS: Record<string, string> = {
  DEPENDENT: 'Dependent',
  PARTIAL: 'Parțial',
  INDEPENDENT: 'Independent'
};

export const SLEEP_LABELS: Record<string, string> = {
  BUN: 'Bun',
  SLAB: 'Slab'
};

export const APPETITE_LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  SCAZUT: 'Scăzut'
};
