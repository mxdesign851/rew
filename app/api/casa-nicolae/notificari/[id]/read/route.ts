import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiUser } from '@/lib/session';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ error: 'Necesită autentificare' }, { status: 401 });
  }

  await prisma.medicationNotification.update({
    where: { id: params.id },
    data: { isRead: true }
  });

  return NextResponse.json({ ok: true });
}
