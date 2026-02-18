import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiUserOrThrow } from '@/lib/api-auth';
import { jsonError, HttpError } from '@/lib/http';
import { mapPrismaMedicationItem, toMedicationCategoryLabel } from '@/lib/medications';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText } from '@/lib/sanitize';
import { assertWorkspaceAccess } from '@/lib/tenant';

type Params = { params: { workspaceId: string; itemId: string } };

const createPurchaseSchema = z.object({
  quantity: z.coerce.number().positive().max(100_000),
  unitPrice: z.coerce.number().min(0).max(100_000).nullable().optional(),
  purchasedAt: z.string().optional().nullable(),
  supplier: z.string().max(120).optional().nullable(),
  updateStock: z.boolean().default(true)
});

function parseOptionalDate(value?: string | null) {
  if (!value) return new Date();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpError(400, 'Data achizitiei este invalida');
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

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN]);
    const parsed = createPurchaseSchema.parse(await request.json());

    const existing = await prisma.medicationItem.findFirst({
      where: { id: params.itemId, workspaceId: params.workspaceId },
      select: { id: true }
    });
    if (!existing) {
      throw new HttpError(404, 'Medicamentul nu a fost gasit');
    }

    const purchasedAt = parseOptionalDate(parsed.purchasedAt);
    const supplier = sanitizeOptionalText(parsed.supplier, 120);

    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.medicationPurchase.create({
        data: {
          workspaceId: params.workspaceId,
          itemId: params.itemId,
          quantity: parsed.quantity,
          unitPrice: parsed.unitPrice ?? null,
          purchasedAt,
          supplier,
          createdById: user.id
        }
      });

      const item = await tx.medicationItem.update({
        where: { id: params.itemId },
        data: {
          ...(parsed.updateStock ? { stockQuantity: { increment: parsed.quantity } } : {}),
          ...(parsed.unitPrice !== undefined ? { lastUnitPrice: parsed.unitPrice } : {}),
          lastPurchaseAt: purchasedAt
        },
        include: {
          purchases: {
            select: { unitPrice: true, purchasedAt: true },
            orderBy: { purchasedAt: 'desc' },
            take: 6
          }
        }
      });

      return { purchase, item };
    });

    return NextResponse.json({
      purchase: {
        ...result.purchase,
        quantity: Number(result.purchase.quantity),
        unitPrice: result.purchase.unitPrice === null ? null : Number(result.purchase.unitPrice),
        purchasedAt: result.purchase.purchasedAt.toISOString(),
        createdAt: result.purchase.createdAt.toISOString()
      },
      item: serializeMedication(mapPrismaMedicationItem(result.item))
    });
  } catch (error) {
    return jsonError(error);
  }
}
