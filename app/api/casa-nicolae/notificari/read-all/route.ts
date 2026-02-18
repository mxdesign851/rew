import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiUser } from '@/lib/session';

export async function POST() {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  await prisma.medicationNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true }
  });

  return NextResponse.json({ ok: true });
}
