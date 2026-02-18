import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireApiUserOrThrow } from '@/lib/api-auth';
import { jsonError } from '@/lib/http';
import {
  calculateMedicationAlerts,
  estimateRestockQuantity,
  formatCurrencyRon,
  formatShortDate,
  mapPrismaMedicationItem,
  summarizeMedicationAlerts,
  toMedicationCategoryLabel
} from '@/lib/medications';
import { createSinglePagePdf } from '@/lib/pdf';
import { prisma } from '@/lib/prisma';
import { assertWorkspaceAccess } from '@/lib/tenant';

type Params = { params: { workspaceId: string } };

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireApiUserOrThrow();
    const membership = await assertWorkspaceAccess(user.id, params.workspaceId, [Role.OWNER, Role.ADMIN, Role.MEMBER]);

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
    const byId = new Map(projected.map((item) => [item.id, item]));
    const alerts = calculateMedicationAlerts(projected, preference.expiryAlertDays);
    const summary = summarizeMedicationAlerts(alerts);

    const missingAlerts = alerts.filter((alert) => alert.type === 'OUT_OF_STOCK' || alert.type === 'LOW_STOCK');
    const expiringAlerts = alerts.filter((alert) => alert.type === 'EXPIRING_SOON');

    const generatedAt = new Date();
    const sections = [
      {
        title: 'Rezumat',
        lines: [
          `Workspace: ${membership.workspace.name}`,
          `Generat la: ${generatedAt.toLocaleString('ro-RO')}`,
          `Lipsa critica: ${summary.outOfStock}`,
          `Stoc redus: ${summary.lowStock}`,
          `Expira in ${preference.expiryAlertDays} zile: ${summary.expiringSoon}`
        ]
      },
      {
        title: 'Lista lipsuri / reaprovizionare',
        lines:
          missingAlerts.length > 0
            ? missingAlerts.map((alert, index) => {
                const item = byId.get(alert.itemId);
                const restockQty = item ? estimateRestockQuantity(item) : alert.missingQuantity;
                const pricePart =
                  alert.predictedUnitPrice && restockQty > 0
                    ? ` | cost estimat ${formatCurrencyRon(restockQty * alert.predictedUnitPrice)}`
                    : '';
                const runout = alert.predictedRunoutAt ? formatShortDate(alert.predictedRunoutAt) : '-';
                return `${index + 1}. ${alert.name} (${toMedicationCategoryLabel(alert.category)}${
                  alert.shelf ? ` / raft ${alert.shelf}` : ''
                }) - stoc ${alert.stockQuantity}/${alert.minStockThreshold} ${alert.unit}; necesar ${restockQty} ${
                  alert.unit
                }; epuizare estimata ${runout}${pricePart}`;
              })
            : ['Nu exista medicamente sub prag in acest moment.']
      },
      {
        title: 'Medicamente cu expirare apropiata',
        lines:
          expiringAlerts.length > 0
            ? expiringAlerts.map(
                (alert, index) =>
                  `${index + 1}. ${alert.name} - expira ${formatShortDate(alert.expiresAt)} | stoc ${alert.stockQuantity} ${
                    alert.unit
                  }`
              )
            : ['Nu exista alerte de expirare in intervalul configurat.']
      }
    ];

    const pdfBytes = await createSinglePagePdf({
      title: 'Fisa interna stoc medicamente',
      subtitle:
        'Document orientativ pentru aprovizionare si monitorizare. Se recomanda verificare fizica inainte de comanda finala.',
      sections,
      footerNote: 'Generat automat de modulul intern de gestiune medicamente.'
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lista-lipsuri-${params.workspaceId}.pdf"`
      }
    });
  } catch (error) {
    return jsonError(error);
  }
}
