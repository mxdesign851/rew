import { ProfilBeneficiar, ProfilGenerat } from '@/types';

const COMUNICARE_LABEL: Record<string, string> = {
  mic: 'redus',
  mediu: 'mediu',
  bun: 'bun',
};
const STRES_LABEL: Record<string, string> = {
  calm: 'calm',
  agitat: 'agitat',
  crize: 'prezinta crize',
};
const RELATIONARE_LABEL: Record<string, string> = {
  retras: 'retras social',
  sociabil: 'sociabil',
  agresiv: 'manifestari agresive',
};
const AUTONOMIE_LABEL: Record<string, string> = {
  dependent: 'dependent de sprijin',
  partial: 'partial autonom',
  independent: 'independent',
};
const LOCATIVA_LABEL: Record<string, string> = {
  fara_adapost: 'fara adapost',
  centru: 'in centru rezidential',
  familie: 'in familie',
};
const FRECVENTA_LABEL: Record<string, string> = {
  zilnic: 'zilnic',
  saptamanal: 'saptamanal',
  lunar: 'lunar',
  rar: 'rar',
  niciodata: 'fara contact',
};

export function generateProfil(profil: ProfilBeneficiar): ProfilGenerat {
  const { dateBaza, situatieSociala, stareMedicala, comportament, stareEmotionala } = profil;

  const contextPersonal = buildContextPersonal(dateBaza, situatieSociala, stareMedicala);
  const profilEmotional = buildProfilEmotional(comportament, stareEmotionala);
  const nevoiPrincipale = buildNevoi(situatieSociala, comportament, stareEmotionala, stareMedicala);
  const riscuri = buildRiscuri(situatieSociala, comportament, stareEmotionala, stareMedicala);
  const recomandariPersonal = buildRecomandari(comportament, stareEmotionala);
  const planSprijin = buildPlan(nevoiPrincipale, riscuri, stareMedicala);

  return {
    contextPersonal,
    profilEmotional,
    nevoiPrincipale,
    riscuri,
    recomandariPersonal,
    planSprijin,
    dataGenerare: new Date().toISOString(),
  };
}

function buildContextPersonal(
  date: ProfilBeneficiar['dateBaza'],
  social: ProfilBeneficiar['situatieSociala'],
  medical: ProfilBeneficiar['stareMedicala']
): string {
  const parts: string[] = [];

  parts.push(
    `Beneficiar${date.sex === 'F' ? 'a' : 'ul'} ${date.prenume}, in varsta de ${date.varsta} ani, ` +
      `se afla ${LOCATIVA_LABEL[social.stareLocativa] || social.stareLocativa}.`
  );

  if (social.areFamilie === 'da') {
    parts.push(`Are familie, cu contact ${FRECVENTA_LABEL[social.frecventaContact] || social.frecventaContact}.`);
  } else if (social.areFamilie === 'partial') {
    parts.push(`Are contact partial cu familia (${FRECVENTA_LABEL[social.frecventaContact] || social.frecventaContact}).`);
  } else {
    parts.push('Nu are suport familial identificat.');
  }

  if (social.istoricInstitutionalizare) {
    parts.push(`Istoric institutionalizare: ${social.istoricInstitutionalizare}.`);
  }

  if (medical.boliCunoscute && medical.boliDetalii) {
    parts.push(`Prezinta conditii medicale cunoscute: ${medical.boliDetalii}.`);
  }

  if (medical.medicatie) {
    parts.push(`Urmeaza medicatie: ${medical.medicatie}.`);
  }

  if (medical.handicap) {
    parts.push(`Limitari: ${medical.handicap}.`);
  }

  return parts.join(' ');
}

function buildProfilEmotional(
  comp: ProfilBeneficiar['comportament'],
  emo: ProfilBeneficiar['stareEmotionala']
): string {
  const parts: string[] = [];

  parts.push(
    `Nivel de comunicare ${COMUNICARE_LABEL[comp.comunicare]}, ` +
      `reactie la stres: ${STRES_LABEL[comp.reactieStres]}.`
  );

  parts.push(
    `Din punct de vedere relational, beneficiarul este ${RELATIONARE_LABEL[comp.relationare]}, ` +
      `cu nivel de autonomie: ${AUTONOMIE_LABEL[comp.autonomie]}.`
  );

  if (comp.somn === 'slab') parts.push('Prezinta tulburari de somn.');
  if (comp.apetit === 'scazut') parts.push('Apetit scazut semnalat.');

  const emotii: string[] = [];
  if (emo.tristete) emotii.push('semne de tristete frecventa');
  if (emo.anxietate) emotii.push('manifestari anxioase');
  if (emo.furie) emotii.push('episoade de furie');
  if (emo.apatie) emotii.push('stare de apatie');
  if (emo.speranta) emotii.push('exprima speranta si motivatie');

  if (emotii.length > 0) {
    parts.push(`Se observa: ${emotii.join(', ')}.`);
  }

  return parts.join(' ');
}

function buildNevoi(
  social: ProfilBeneficiar['situatieSociala'],
  comp: ProfilBeneficiar['comportament'],
  emo: ProfilBeneficiar['stareEmotionala'],
  medical: ProfilBeneficiar['stareMedicala']
): string[] {
  const nevoi: string[] = [];

  if (social.areFamilie !== 'da' || social.frecventaContact === 'rar' || social.frecventaContact === 'niciodata') {
    nevoi.push('Nevoie de atasament si conexiune sociala');
  }

  if (social.stareLocativa === 'fara_adapost') {
    nevoi.push('Nevoie urgenta de stabilitate locativa');
  }

  if (comp.relationare === 'retras' || emo.apatie) {
    nevoi.push('Nevoie de integrare sociala si activitati de grup');
  }

  if (medical.boliCunoscute || medical.medicatie) {
    nevoi.push('Nevoie de monitorizare si continuitate a tratamentului medical');
  }

  if (comp.autonomie === 'dependent') {
    nevoi.push('Nevoie de sprijin pentru dezvoltarea autonomiei');
  }

  if (emo.tristete || emo.anxietate) {
    nevoi.push('Nevoie de suport emotional si consiliere');
  }

  if (comp.somn === 'slab' || comp.apetit === 'scazut') {
    nevoi.push('Nevoie de monitorizare a starii de sanatate de baza (somn, alimentatie)');
  }

  if (nevoi.length === 0) {
    nevoi.push('Nevoie de mentinere a echilibrului actual si monitorizare periodica');
  }

  return nevoi;
}

function buildRiscuri(
  social: ProfilBeneficiar['situatieSociala'],
  comp: ProfilBeneficiar['comportament'],
  emo: ProfilBeneficiar['stareEmotionala'],
  medical: ProfilBeneficiar['stareMedicala']
): string[] {
  const riscuri: string[] = [];

  if (social.areFamilie === 'nu' && social.stareLocativa !== 'centru') {
    riscuri.push('Risc de izolare sociala');
  }

  if (emo.tristete && emo.apatie) {
    riscuri.push('Risc de depresie - necesita atentie');
  }

  if (comp.relationare === 'agresiv' || comp.reactieStres === 'crize') {
    riscuri.push('Risc de comportament disruptiv - necesita strategii de gestionare');
  }

  if (comp.relationare === 'retras' && emo.apatie) {
    riscuri.push('Risc de retragere sociala profunda');
  }

  if (emo.furie && comp.reactieStres === 'agitat') {
    riscuri.push('Risc de escaladare a conflictelor');
  }

  if (medical.boliCunoscute && !medical.medicatie) {
    riscuri.push('Risc legat de boli netratate - necesita evaluare medicala');
  }

  if (social.stareLocativa === 'fara_adapost') {
    riscuri.push('Vulnerabilitate ridicata datorita lipsei adapostului');
  }

  if (riscuri.length === 0) {
    riscuri.push('Nivel de risc scazut la momentul evaluarii');
  }

  return riscuri;
}

function buildRecomandari(
  comp: ProfilBeneficiar['comportament'],
  emo: ProfilBeneficiar['stareEmotionala']
): string[] {
  const rec: string[] = [];

  rec.push('Utilizati un ton calm si empatic in comunicare');
  rec.push('Oferiti structura si predictibilitate in activitatile zilnice');

  if (comp.reactieStres === 'agitat' || comp.reactieStres === 'crize') {
    rec.push('Evitati confruntarea directa; redirectionati atentia in momentele de criza');
    rec.push('Permiteti pauze si spatiu personal cand este agitat');
  }

  if (comp.relationare === 'retras') {
    rec.push('Incurajati participarea la activitati de grup fara presiune');
    rec.push('Initiati conversatii scurte si prietenoase');
  }

  if (comp.relationare === 'agresiv') {
    rec.push('Stabiliti limite clare, ferme dar respectuoase');
    rec.push('Recompensati comportamentul pozitiv');
  }

  if (emo.tristete || emo.anxietate) {
    rec.push('Oferiti reasigurare si validare emotionala');
    rec.push('Propuneti activitati placute: plimbari, muzica, art-terapie');
  }

  if (comp.autonomie === 'dependent') {
    rec.push('Incurajati pasi mici spre autonomie cu sprijin constant');
  }

  if (comp.comunicare === 'mic') {
    rec.push('Folositi comunicare simpla, clara, cu propozitii scurte');
    rec.push('Verificati intelegerea mesajelor transmise');
  }

  return rec;
}

function buildPlan(
  nevoi: string[],
  riscuri: string[],
  medical: ProfilBeneficiar['stareMedicala']
): string[] {
  const plan: string[] = [];

  plan.push('Monitorizare saptamanala a starii emotionale si comportamentale');

  if (nevoi.some((n) => n.includes('consiliere') || n.includes('emotional'))) {
    plan.push('Programare sedinte de consiliere psihologica (saptamanal sau bilunar)');
  }

  if (nevoi.some((n) => n.includes('integrare') || n.includes('sociala'))) {
    plan.push('Includere in activitati de socializare si ocupationale');
  }

  if (medical.boliCunoscute) {
    plan.push('Consultatie medicala periodica si urmarirea aderentei la tratament');
  }

  if (nevoi.some((n) => n.includes('familie') || n.includes('atasament'))) {
    plan.push('Facilitarea contactului cu familia (unde este posibil si benefic)');
  }

  if (riscuri.some((r) => r.includes('depresie'))) {
    plan.push('Evaluare psihologica aprofundata in termen de 2 saptamani');
  }

  if (nevoi.some((n) => n.includes('locativa'))) {
    plan.push('Demersuri urgente pentru gasirea unei solutii locative stabile');
  }

  plan.push('Reevaluare profil psihosocial la 30 de zile');

  return plan;
}
