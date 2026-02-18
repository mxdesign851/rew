import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiUser } from '@/lib/session';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  const med = await prisma.medication.findUnique({
    where: { id: params.id },
    include: { category: true }
  });
  if (!med) {
    return NextResponse.json({ error: 'Medicament negăsit' }, { status: 404 });
  }
  return NextResponse.json(med);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  const body = await req.json();
  const { name, categoryType, quantity, minQuantity, unit, notes } = body;

  const existing = await prisma.medication.findUnique({
    where: { id: params.id },
    include: { category: true }
  });
  if (!existing) {
    return NextResponse.json({ error: 'Medicament negăsit' }, { status: 404 });
  }

  let categoryId = existing.categoryId;
  if (categoryType && categoryType !== existing.category.type) {
    const cat = await prisma.medicationCategory.findUnique({
      where: { type: categoryType }
    });
    if (cat) categoryId = cat.id;
  }

  const med = await prisma.medication.update({
    where: { id: params.id },
    data: {
      categoryId,
      ...(name != null && { name: String(name) }),
      ...(quantity != null && { quantity: Number(quantity) }),
      ...(minQuantity != null && { minQuantity: Number(minQuantity) }),
      ...(unit != null && { unit: String(unit) }),
      ...(notes !== undefined && { notes: notes ? String(notes) : null })
    }
  });

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
