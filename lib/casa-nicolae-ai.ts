import OpenAI from 'openai';

/**
 * Generează profil psihosocial ORIENTATIV de sprijin.
 * NU pune diagnostice. Oferă recomandări pentru personal.
 */
export async function generateBeneficiaryProfile(input: {
  firstName: string;
  age: number;
  sex: string;
  location: string;
  hasFamily: string;
  housingStatus: string;
  familyContactFreq?: string;
  institutionalHistory?: string;
  knownIllnesses?: string;
  medication?: string;
  disabilities?: string;
  communicationLevel: string;
  stressReaction: string;
  relationStyle: string;
  autonomyLevel: string;
  sleepQuality: string;
  appetiteLevel: string;
  sadnessFrequent: boolean;
  anxiety: boolean;
  anger: boolean;
  apathy: boolean;
  hopeMotivation: boolean;
  observations?: string;
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY lipsă');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Ești asistent pentru personalul unei case de sprijin social. Generă un PROFIL PSIHOSOCIAL ORIENTATIV de sprijin pentru un beneficiar.

REGULI CRITICE - NU încălca niciodată:
- NU pune DIAGNOSTICE medicale sau psihiatrice (ex: "are depresie", "are anxietate generalizată")
- NU folosi etichete clinic (ex: "pacient bipolar", "schizofrenie")
- DOAR descrie comportamente observate și oferă RECOMANDĂRI PRACTICE pentru personal
- Limbaj: "prezintă semne de...", "nevoie de...", "beneficiază de..."

Date introduse:
- Prenume/cod: ${input.firstName}
- Vârstă: ${input.age}, Sex: ${input.sex}
- Locație: ${input.location}
- Are familie: ${input.hasFamily}
- Stare locativă: ${input.housingStatus}
- Frecvență contact familie: ${input.familyContactFreq || '-'}
- Istoric instituționalizare: ${input.institutionalHistory || '-'}
- Boli cunoscute: ${input.knownIllnesses || '-'}
- Medicație: ${input.medication || '-'}
- Handicap/limitări: ${input.disabilities || '-'}
- Nivel comunicare: ${input.communicationLevel}
- Reacție la stres: ${input.stressReaction}
- Relaționare: ${input.relationStyle}
- Autonomie: ${input.autonomyLevel}
- Somn: ${input.sleepQuality}
- Apetit: ${input.appetiteLevel}
- Tristețe frecventă: ${input.sadnessFrequent ? 'da' : 'nu'}
- Anxietate: ${input.anxiety ? 'da' : 'nu'}
- Furie: ${input.anger ? 'da' : 'nu'}
- Apatie: ${input.apathy ? 'da' : 'nu'}
- Speranță/motivație: ${input.hopeMotivation ? 'da' : 'nu'}
- Observații: ${input.observations || '-'}

Generează un profil în limba română, cu secțiunile:

1. CONTEXT PERSONAL (2-3 propoziții despre situația de viață și vulnerabilități, fără diagnostice)
2. PROFIL EMOȚIONAL (nivel stres, adaptare, reziliență - descrieri comportamentale, NU diagnostice)
3. NEVOI PRINCIPALE (atașament, stabilitate, tratament, integrare socială - enumerate scurt)
4. RISCURI (abandon, dependență, izolare etc - formulate orientativ)
5. RECOMANDĂRI PENTRU PERSONAL (ton calm, structură, evitare conflict, activități recomandate)
6. PLAN DE SPRIJIN (pași următori: consiliere, reintegrare, medical, familie)

Fiecare secțiune: maxim 2-3 propoziții. Total: maxim 350 cuvinte. Fără diagnostice medicale.`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 800
  });

  return completion.choices[0]?.message?.content?.trim() ?? '';
}
