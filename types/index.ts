export type CategorieMedicament =
  | 'cardio'
  | 'diabet'
  | 'gastro'
  | 'respirator'
  | 'neuro'
  | 'psihiatric'
  | 'antibiotice'
  | 'durere'
  | 'alergii'
  | 'dermato'
  | 'vitamine'
  | 'altele';

export interface Medicament {
  id: string;
  nume: string;
  categorie: CategorieMedicament;
  stoc: number;
  stocMinim: number;
  pret: number;
  dataExpirare?: string;
  furnizor?: string;
  note?: string;
  dataAdaugare: string;
  dataActualizare: string;
}

export type NivelComunicare = 'mic' | 'mediu' | 'bun';
export type ReactieStres = 'calm' | 'agitat' | 'crize';
export type Relationare = 'retras' | 'sociabil' | 'agresiv';
export type Autonomie = 'dependent' | 'partial' | 'independent';
export type NivelSomn = 'bun' | 'slab';
export type NivelApetit = 'normal' | 'scazut';
export type StareLocativa = 'fara_adapost' | 'centru' | 'familie';
export type FrecventaFamilie = 'zilnic' | 'saptamanal' | 'lunar' | 'rar' | 'niciodata';

export interface DateBaza {
  prenume: string;
  codIntern?: string;
  varsta: number | '';
  sex: 'M' | 'F' | '';
  locatie: string;
  dataEvaluare: string;
  persoanaResponsabila: string;
}

export interface SituatieSociala {
  areFamilie: 'da' | 'nu' | 'partial';
  stareLocativa: StareLocativa;
  frecventaContact: FrecventaFamilie;
  istoricInstitutionalizare: string;
}

export interface StareMedicala {
  boliCunoscute: boolean;
  boliDetalii?: string;
  medicatie?: string;
  handicap?: string;
  evaluarePsihologicaAnterioara: boolean;
}

export interface ComportamentObservat {
  comunicare: NivelComunicare;
  reactieStres: ReactieStres;
  relationare: Relationare;
  autonomie: Autonomie;
  somn: NivelSomn;
  apetit: NivelApetit;
}

export interface StareEmotionala {
  tristete: boolean;
  anxietate: boolean;
  furie: boolean;
  apatie: boolean;
  speranta: boolean;
}

export interface ProfilBeneficiar {
  id: string;
  dateBaza: DateBaza;
  situatieSociala: SituatieSociala;
  stareMedicala: StareMedicala;
  comportament: ComportamentObservat;
  stareEmotionala: StareEmotionala;
  observatiiSuplimentare?: string;
  profilGenerat?: ProfilGenerat;
  dataCreare: string;
  dataActualizare: string;
}

export interface ProfilGenerat {
  contextPersonal: string;
  profilEmotional: string;
  nevoiPrincipale: string[];
  riscuri: string[];
  recomandariPersonal: string[];
  planSprijin: string[];
  dataGenerare: string;
}
