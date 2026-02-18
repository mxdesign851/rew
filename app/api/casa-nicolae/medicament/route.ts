import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureMedicationCategories } from '@/lib/casa-nicolae-db';
import { requireApiUser } from '@/lib/session';

export async function POST(req: Request) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  await ensureMedicationCategories();

  const body = await req.json();
  const { name, categoryType, quantity, minQuantity, unit, notes } = body;

  if (!name || !categoryType) {
    return NextResponse.json(
      { error: 'Lipsește numele sau categoria' },
      { status: 400 }
    );
  }

  const category = await prisma.medicationCategory.findUnique({
    where: { type: categoryType }
  });
  if (!category) {
    return NextResponse.json({ error: 'Categorie invalidă' }, { status: 400 });
  }

  const med = await prisma.medication.create({
    data: {
      categoryId: category.id,
      name: String(name),
      quantity: Number(quantity) ?? 0,
      minQuantity: Number(minQuantity) ?? 5,
      unit: String(unit || 'buc'),
      notes: notes ? String(notes) : null
    }
  });

  // Notificare dacă stoc mic
  if (med.quantity <= med.minQuantity) {
    await prisma.medicationNotification.create({
      data: {
        message: `Stoc mic: ${med.name} - ${med.quantity} ${med.unit} rămase`,
        medicationId: med.id
      }
    });
  }

  return NextResponse.json(med);
}
