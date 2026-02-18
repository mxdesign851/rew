import jsPDF from 'jspdf';
import { Medicament, CategorieMedicament } from '@/types';

const MARGIN = 14;
const PAGE_W = 210;

const CATEGORIE_LABEL: Record<CategorieMedicament, string> = {
  cardio: 'Cardio',
  diabet: 'Diabet',
  gastro: 'Gastro',
  respirator: 'Respirator',
  neuro: 'Neuro',
  psihiatric: 'Psihiatric',
  antibiotice: 'Antibiotice',
  durere: 'Durere',
  alergii: 'Alergii',
  dermato: 'Dermato',
  vitamine: 'Vitamine',
  altele: 'Altele',
};

export function generateMedicamentePDF(items: Medicament[], title: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CASA NICOLAE', PAGE_W / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(11);
  doc.text(title, PAGE_W / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Generat: ${new Date().toLocaleDateString('ro-RO')}`, PAGE_W / 2, y, { align: 'center' });
  doc.setTextColor(0);
  y += 5;

  doc.setDrawColor(180);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 5;

  const grouped = new Map<string, Medicament[]>();
  for (const item of items) {
    const cat = CATEGORIE_LABEL[item.categorie] || item.categorie;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  const colX = [MARGIN, 80, 110, 140, 165];
  const headers = ['Medicament', 'Categorie', 'Stoc', 'Pret (RON)', 'Expirare'];

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  y += 2;
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  for (const [cat, meds] of grouped) {
    if (y > 275) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 71, 120);
    doc.text(cat.toUpperCase(), MARGIN, y);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    y += 4;

    for (const med of meds) {
      if (y > 280) {
        doc.addPage();
        y = MARGIN;
      }

      const isLow = med.stoc <= med.stocMinim;
      doc.text(med.nume, colX[0], y);
      doc.text(cat, colX[1], y);

      if (isLow) doc.setTextColor(200, 0, 0);
      doc.text(`${med.stoc} / min ${med.stocMinim}`, colX[2], y);
      if (isLow) doc.setTextColor(0);

      doc.text(med.pret ? `${med.pret.toFixed(2)}` : '-', colX[3], y);
      doc.text(med.dataExpirare ? formatDate(med.dataExpirare) : '-', colX[4], y);
      y += 3.5;
    }

    y += 2;
  }

  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total medicamente: ${items.length}`, MARGIN, y);

  const lowStock = items.filter((m) => m.stoc <= m.stocMinim);
  if (lowStock.length > 0) {
    y += 4;
    doc.setTextColor(200, 0, 0);
    doc.text(`Atentie! ${lowStock.length} medicamente cu stoc scazut`, MARGIN, y);
    doc.setTextColor(0);
  }

  const filename = `medicamente_${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toLocaleDateString('ro-RO').replace(/\//g, '-')}.pdf`;
  doc.save(filename);
}

export function generateListaCumparaturi(items: Medicament[]) {
  const lowStock = items.filter((m) => m.stoc <= m.stocMinim);
  generateMedicamentePDF(lowStock, 'LISTA DE CUMPARATURI - Stoc Scazut');
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ro-RO');
  } catch {
    return iso;
  }
}
