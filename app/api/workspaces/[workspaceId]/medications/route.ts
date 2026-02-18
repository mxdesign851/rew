import { MedicationCategory, Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiUserOrThrow } from '@/lib/api-auth';
import { jsonError, HttpError } from '@/lib/http';
import {
  calculateMedicationAlerts,
  mapPrismaMedicationItem,
  summarizeMedicationAlerts,
  toMedicationCategoryLabel
} from '@/lib/medications';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeText } from '@/lib/sanitize';
import { assertWorkspaceAccess } from '@/lib/tenant';

type Params = { params: { workspaceId: string } };

const createMedicationSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.nativeEnum(MedicationCategory),
  shelf: z.string().max(80).optional().nullable(),
  stockQuantity: z.coerce.number().min(0).max(100_000).default(0),
  minStockThreshold: z.coerce.number().min(0).max(100_000).default(1),
  unit: z.string().min(1).max(20).default('cutii'),
  dailyUsage: z.coerce.number().min(0).max(20_000).optional().nullable(),
  lastUnitPrice: z.coerce.number().min(0).max(100_000).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  notifyOnLowStock: z.boolean().default(true)
});

function parseOptionalDate(value?: string | null) {
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

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN, Role.MEMBER]);

    const [items, preference] = await prisma.$transaction([
      prisma.medicationItem.findMany({
        where: { workspaceId: params.workspaceId },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
        include: {
          purchases: {
            select: { unitPrice: true, purchasedAt: true },
            orderBy: { purchasedAt: 'desc' },
            take: 6
          }
        }
      }),
      prisma.medicationNotificationPreference.upsert({
        where: { workspaceId: params.workspaceId },
        update: {},
        create: { workspaceId: params.workspaceId }
      })
    ]);

    const projected = items.map(mapPrismaMedicationItem);
    const alerts = calculateMedicationAlerts(projected, preference.expiryAlertDays);
    const summary = summarizeMedicationAlerts(alerts);

    const phoneNotificationPreview =
      preference.enablePhoneAlerts && preference.phoneNumber
        ? [
            `Alerte stoc ${new Date().toLocaleDateString('ro-RO')}:`,
            ...alerts.slice(0, 5).map((alert) => {
              if (alert.type === 'EXPIRING_SOON') {
                return `- ${alert.name}: expira ${alert.expiresAt?.toLocaleDateString('ro-RO') ?? '-'}`;
              }
              return `- ${alert.name}: ${alert.stockQuantity} / prag ${alert.minStockThreshold} ${alert.unit}`;
            })
          ].join('\n')
        : null;

    return NextResponse.json({
      items: projected.map(serializeMedication),
      preference,
      alerts: alerts.map((alert) => ({
        ...alert,
        categoryLabel: toMedicationCategoryLabel(alert.category),
        expiresAt: alert.expiresAt?.toISOString() ?? null,
        predictedRunoutAt: alert.predictedRunoutAt?.toISOString() ?? null
      })),
      summary,
      phoneNotificationPreview
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN]);

    const parsed = createMedicationSchema.parse(await request.json());
    const name = sanitizeText(parsed.name, 120);
    const shelf = sanitizeOptionalText(parsed.shelf, 80);
    const notes = sanitizeOptionalText(parsed.notes, 1000);
    const unit = sanitizeText(parsed.unit, 20) || 'cutii';
    const expiresAt = parseOptionalDate(parsed.expiresAt);

    const duplicate = await prisma.medicationItem.findFirst({
      where: {
        workspaceId: params.workspaceId,
        name,
        shelf
      },
      select: { id: true }
    });
    if (duplicate) {
      throw new HttpError(409, 'Medicamentul exista deja pe acest raft');
    }

    const created = await prisma.medicationItem.create({
      data: {
        workspaceId: params.workspaceId,
        name,
        category: parsed.category,
        shelf,
        stockQuantity: parsed.stockQuantity,
        minStockThreshold: parsed.minStockThreshold,
        unit,
        dailyUsage: parsed.dailyUsage ?? null,
        lastUnitPrice: parsed.lastUnitPrice ?? null,
        expiresAt,
        notes,
        notifyOnLowStock: parsed.notifyOnLowStock
      },
      include: {
        purchases: {
          select: { unitPrice: true, purchasedAt: true },
          orderBy: { purchasedAt: 'desc' },
          take: 6
        }
      }
    });

    return NextResponse.json({ item: serializeMedication(mapPrismaMedicationItem(created)) }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
