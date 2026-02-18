import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ensureMedicationCategories } from '@/lib/casa-nicolae-db';

export async function GET() {
  await ensureMedicationCategories();
  const medications = await prisma.medication.findMany({
    include: { category: true },
    orderBy: [{ category: { type: 'asc' } }, { name: 'asc' }]
  });

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Listă Medicamente - Casa Nicolae', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generat: ${new Date().toLocaleString('ro-RO')}`, 14, 28);

  const tableData = medications.map((m) => [
    m.category.name,
    m.name,
    String(m.quantity),
    m.unit,
    m.quantity <= m.minQuantity ? 'STOC MIC' : 'OK'
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['Categorie', 'Medicament', 'Cantitate', 'Unitate', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] }
  });

  const blob = doc.output('arraybuffer');
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="lista-medicamente-casa-nicolae-${new Date().toISOString().slice(0, 10)}.pdf"`
    }
  });
}
