import { Medicament, ProfilBeneficiar } from '@/types';

const MEDICAMENTE_KEY = 'casa_nicolae_medicamente';
const PROFILE_KEY = 'casa_nicolae_profile';

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getMedicamente(): Medicament[] {
  return safeGet<Medicament[]>(MEDICAMENTE_KEY, []);
}

export function saveMedicamente(items: Medicament[]) {
  safeSet(MEDICAMENTE_KEY, items);
}

export function addMedicament(item: Medicament) {
  const all = getMedicamente();
  all.push(item);
  saveMedicamente(all);
  return all;
}

export function updateMedicament(id: string, updates: Partial<Medicament>) {
  const all = getMedicamente();
  const idx = all.findIndex((m) => m.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates, dataActualizare: new Date().toISOString() };
  }
  saveMedicamente(all);
  return all;
}

export function deleteMedicament(id: string) {
  const all = getMedicamente().filter((m) => m.id !== id);
  saveMedicamente(all);
  return all;
}

export function getProfile(): ProfilBeneficiar[] {
  return safeGet<ProfilBeneficiar[]>(PROFILE_KEY, []);
}

export function saveProfile(items: ProfilBeneficiar[]) {
  safeSet(PROFILE_KEY, items);
}

export function addProfil(item: ProfilBeneficiar) {
  const all = getProfile();
  all.push(item);
  saveProfile(all);
  return all;
}

export function updateProfil(id: string, updates: Partial<ProfilBeneficiar>) {
  const all = getProfile();
  const idx = all.findIndex((p) => p.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates, dataActualizare: new Date().toISOString() };
  }
  saveProfile(all);
  return all;
}

export function deleteProfil(id: string) {
  const all = getProfile().filter((p) => p.id !== id);
  saveProfile(all);
  return all;
}

export function getProfilById(id: string): ProfilBeneficiar | undefined {
  return getProfile().find((p) => p.id === id);
}

export function getMedicamenteLowStock(): Medicament[] {
  return getMedicamente().filter((m) => m.stoc <= m.stocMinim);
}

export function getMedicamenteExpirate(): Medicament[] {
  const now = new Date().toISOString().split('T')[0];
  return getMedicamente().filter((m) => m.dataExpirare && m.dataExpirare <= now);
}
