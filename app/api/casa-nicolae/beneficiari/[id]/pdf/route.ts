import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsPDF } from 'jspdf';
import {
  HOUSING_LABELS,
  COMMUNICATION_LABELS,
  STRESS_LABELS,
  RELATION_LABELS,
  AUTONOMY_LABELS,
  SLEEP_LABELS,
  APPETITE_LABELS
} from '@/lib/casa-nicolae';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const b = await prisma.beneficiary.findUnique({
    where: { id: params.id }
  });

  if (!b) {
    return NextResponse.json({ error: 'Beneficiar negăsit' }, { status: 404 });
  }

  const doc = new jsPDF({ format: 'a4' });
  const margin = 14;
  const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
  let y = margin;
  const lineHeight = 5;
  const fontSmall = 9;
  const fontNorm = 10;
  const fontTitle = 12;

  doc.setFontSize(fontTitle);
  doc.text('Fișă profil sprijin – Dosar beneficiar', margin, y);
  y += lineHeight + 2;

  doc.setFontSize(fontSmall);
  doc.text(
    `Prenume: ${b.firstName} | Vârstă: ${b.age} | Sex: ${b.sex} | Locație: ${b.location}`,
    margin,
    y
  );
  y += lineHeight;
  doc.text(
    `Data evaluării: ${new Date(b.evaluationDate).toLocaleDateString('ro-RO')} | Responsabil: ${b.responsiblePerson}`,
    margin,
    y
  );
  y += lineHeight + 2;

  doc.setFontSize(fontNorm);
  doc.text('Rezumat social:', margin, y);
  y += lineHeight;
  doc.setFontSize(fontSmall);
  doc.text(
    `Familie: ${b.hasFamily} | Stare locativă: ${HOUSING_LABELS[b.housingStatus] ?? b.housingStatus} | Contact familie: ${b.familyContactFreq || '-'}`,
    margin,
    y
  );
  y += lineHeight;
  doc.text(
    `Comunicare: ${COMMUNICATION_LABELS[b.communicationLevel] ?? b.communicationLevel} | Relaționare: ${RELATION_LABELS[b.relationStyle] ?? b.relationStyle} | Autonomie: ${AUTONOMY_LABELS[b.autonomyLevel] ?? b.autonomyLevel}`,
    margin,
    y
  );
  y += lineHeight;
  doc.text(
    `Somn: ${SLEEP_LABELS[b.sleepQuality] ?? b.sleepQuality} | Apetit: ${APPETITE_LABELS[b.appetiteLevel] ?? b.appetiteLevel} | Reacție stres: ${STRESS_LABELS[b.stressReaction] ?? b.stressReaction}`,
    margin,
    y
  );
  y += lineHeight + 2;

  if (b.aiProfile) {
    doc.setFontSize(fontNorm);
    doc.text('Profil emoțional / Recomandări:', margin, y);
    y += lineHeight;

    const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const lines = doc.splitTextToSize(b.aiProfile, maxWidth);
    doc.setFontSize(fontSmall);
    for (const line of lines) {
      if (y > 270) break;
      doc.text(line, margin + 2, y);
      y += lineHeight * 0.9;
    }
    y += 2;
  }

  if (b.observations) {
    if (y > 250) y = 250;
    doc.setFontSize(fontNorm);
    doc.text('Observații:', margin, y);
    y += lineHeight;
    const obsLines = doc.splitTextToSize(b.observations, maxWidth);
    doc.setFontSize(fontSmall);
    for (const line of obsLines) {
      if (y > 270) break;
      doc.text(line, margin + 2, y);
      y += lineHeight * 0.9;
    }
    y += 2;
  }

  doc.setFontSize(fontSmall);
  doc.text(
    `Semnătură responsabil: _________________________ | Generat: ${new Date().toLocaleString('ro-RO')}`,
    margin,
    doc.internal.pageSize.getHeight() - 15
  );

  const blob = doc.output('arraybuffer');
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="fisa-profil-${b.firstName}-${new Date().toISOString().slice(0, 10)}.pdf"`
    }
  });
}
