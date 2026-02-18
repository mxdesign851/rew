import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { assertLocationLimit, assertWorkspaceAccess } from '@/lib/tenant';
import { requireUser } from '@/lib/session';

const schema = z.object({
  workspaceId: z.string(),
  name: z.string().min(2),
  timezone: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await assertWorkspaceAccess(userId, parsed.data.workspaceId, [Role.OWNER, Role.ADMIN]);
    await assertLocationLimit(parsed.data.workspaceId);

    const location = await prisma.location.create({
      data: {
        workspaceId: parsed.data.workspaceId,
        name: parsed.data.name,
        timezone: parsed.data.timezone
      }
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}
