import { MedicationCategory, Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiUserOrThrow } from '@/lib/api-auth';
import { jsonError, HttpError } from '@/lib/http';
import { mapPrismaMedicationItem, toMedicationCategoryLabel } from '@/lib/medications';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeText } from '@/lib/sanitize';
import { assertWorkspaceAccess } from '@/lib/tenant';

type Params = { params: { workspaceId: string; itemId: string } };

const updateMedicationSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  category: z.nativeEnum(MedicationCategory).optional(),
  shelf: z.string().max(80).nullable().optional(),
  stockQuantity: z.coerce.number().min(0).max(100_000).optional(),
  minStockThreshold: z.coerce.number().min(0).max(100_000).optional(),
  unit: z.string().min(1).max(20).optional(),
  dailyUsage: z.coerce.number().min(0).max(20_000).nullable().optional(),
  lastUnitPrice: z.coerce.number().min(0).max(100_000).nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  notifyOnLowStock: z.boolean().optional()
});

function parseOptionalDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpError(400, 'Data invalida');
  }
  return parsed;
}

function serializeMedication(item: ReturnType<typeof mapPrismaMedicationItem>) {
  return {
    ...item,
    lastPurchaseAt: item.lastPurchaseAt?.toISOString() ?? null,
    expiresAt: item.expiresAt?.toISOString() ?? null,
    categoryLabel: toMedicationCategoryLabel(item.category),
    purchases: (item.purchases ?? []).map((purchase) => ({
      unitPrice: purchase.unitPrice,
      purchasedAt: purchase.purchasedAt.toISOString()
    }))
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN]);

    const parsed = updateMedicationSchema.parse(await request.json());
    if (!Object.keys(parsed).length) {
      throw new HttpError(400, 'Nu exista campuri pentru actualizare');
    }

    const existing = await prisma.medicationItem.findFirst({
      where: { id: params.itemId, workspaceId: params.workspaceId }
    });
    if (!existing) {
      throw new HttpError(404, 'Medicamentul nu a fost gasit');
    }

    const nextName = parsed.name !== undefined ? sanitizeText(parsed.name, 120) : existing.name;
    const nextShelf = parsed.shelf !== undefined ? sanitizeOptionalText(parsed.shelf, 80) : existing.shelf;

    const duplicate = await prisma.medicationItem.findFirst({
      where: {
        workspaceId: params.workspaceId,
        name: nextName,
        shelf: nextShelf,
        id: { not: params.itemId }
      },
      select: { id: true }
    });
    if (duplicate) {
      throw new HttpError(409, 'Exista deja un medicament cu acelasi nume si raft');
    }

    const updated = await prisma.medicationItem.update({
      where: { id: params.itemId },
      data: {
        ...(parsed.name !== undefined ? { name: nextName } : {}),
        ...(parsed.category !== undefined ? { category: parsed.category } : {}),
        ...(parsed.shelf !== undefined ? { shelf: nextShelf } : {}),
        ...(parsed.stockQuantity !== undefined ? { stockQuantity: parsed.stockQuantity } : {}),
        ...(parsed.minStockThreshold !== undefined ? { minStockThreshold: parsed.minStockThreshold } : {}),
        ...(parsed.unit !== undefined ? { unit: sanitizeText(parsed.unit, 20) || existing.unit } : {}),
        ...(parsed.dailyUsage !== undefined ? { dailyUsage: parsed.dailyUsage } : {}),
        ...(parsed.lastUnitPrice !== undefined ? { lastUnitPrice: parsed.lastUnitPrice } : {}),
        ...(parsed.expiresAt !== undefined ? { expiresAt: parseOptionalDate(parsed.expiresAt) } : {}),
        ...(parsed.notes !== undefined ? { notes: sanitizeOptionalText(parsed.notes, 1000) } : {}),
        ...(parsed.notifyOnLowStock !== undefined ? { notifyOnLowStock: parsed.notifyOnLowStock } : {})
      },
      include: {
        purchases: {
          select: { unitPrice: true, purchasedAt: true },
          orderBy: { purchasedAt: 'desc' },
          take: 6
        }
      }
    });

    return NextResponse.json({ item: serializeMedication(mapPrismaMedicationItem(updated)) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN]);

    const existing = await prisma.medicationItem.findFirst({
      where: { id: params.itemId, workspaceId: params.workspaceId },
      select: { id: true }
    });
    if (!existing) {
      throw new HttpError(404, 'Medicamentul nu a fost gasit');
    }

    await prisma.medicationItem.delete({ where: { id: params.itemId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
