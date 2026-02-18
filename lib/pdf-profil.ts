import jsPDF from 'jspdf';
import { ProfilBeneficiar } from '@/types';

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function generateProfilPDF(profil: ProfilBeneficiar) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const gen = profil.profilGenerat;
  if (!gen) return;

  let y = MARGIN;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CASA NICOLAE - PROFIL PSIHOSOCIAL ORIENTATIV', PAGE_W / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Document orientativ - NU constituie diagnostic medical sau psihologic', PAGE_W / 2, y, { align: 'center' });
  doc.setTextColor(0);
  y += 5;

  doc.setDrawColor(180);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4;

  y = section(doc, y, 'DATE IDENTIFICARE', [
    `Prenume/Cod: ${profil.dateBaza.prenume}${profil.dateBaza.codIntern ? ` (${profil.dateBaza.codIntern})` : ''}`,
    `Varsta: ${profil.dateBaza.varsta} ani | Sex: ${profil.dateBaza.sex === 'M' ? 'Masculin' : 'Feminin'}`,
    `Locatie: ${profil.dateBaza.locatie}`,
    `Data evaluare: ${formatDate(profil.dateBaza.dataEvaluare)} | Responsabil: ${profil.dateBaza.persoanaResponsabila}`,
  ]);

  y = section(doc, y, '1. CONTEXT PERSONAL', [gen.contextPersonal]);

  y = section(doc, y, '2. PROFIL EMOTIONAL SI COMPORTAMENTAL', [gen.profilEmotional]);

  y = section(doc, y, '3. NEVOI PRINCIPALE', gen.nevoiPrincipale.map((n, i) => `${i + 1}. ${n}`));

  y = section(doc, y, '4. RISCURI IDENTIFICATE', gen.riscuri.map((r, i) => `${i + 1}. ${r}`));

  y = section(doc, y, '5. RECOMANDARI PENTRU PERSONAL', gen.recomandariPersonal.map((r) => `- ${r}`));

  y = section(doc, y, '6. PLAN DE SPRIJIN', gen.planSprijin.map((p) => `- ${p}`));

  if (profil.observatiiSuplimentare) {
    y = section(doc, y, 'OBSERVATII SUPLIMENTARE', [profil.observatiiSuplimentare]);
  }

  y += 6;
  if (y < 270) {
    doc.setDrawColor(180);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Semnatura responsabil: ________________________`, MARGIN, y);
    doc.text(`Data: ${formatDate(gen.dataGenerare)}`, PAGE_W - MARGIN, y, { align: 'right' });
  }

  const filename = `profil_${profil.dateBaza.prenume.replace(/\s+/g, '_')}_${formatDate(profil.dateBaza.dataEvaluare)}.pdf`;
  doc.save(filename);
}

function section(doc: jsPDF, startY: number, title: string, lines: string[]): number {
  let y = startY;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 71, 120);
  doc.text(title, MARGIN, y);
  y += 3.5;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30);

  for (const line of lines) {
    const split = doc.splitTextToSize(line, CONTENT_W) as string[];
    for (const s of split) {
      if (y > 284) {
        doc.addPage();
        y = MARGIN;
      }
      doc.text(s, MARGIN, y);
      y += 3.2;
    }
  }

  y += 2;
  return y;
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}
