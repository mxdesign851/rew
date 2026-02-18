import { MedicationCategory } from '@prisma/client';

export type MedicationHistoryPoint = {
  unitPrice: number | null;
  purchasedAt: Date;
};

export type MedicationProjection = {
  id: string;
  name: string;
  category: MedicationCategory;
  shelf: string | null;
  stockQuantity: number;
  minStockThreshold: number;
  unit: string;
  dailyUsage: number | null;
  lastUnitPrice: number | null;
  lastPurchaseAt: Date | null;
  expiresAt: Date | null;
  notifyOnLowStock: boolean;
  purchases?: MedicationHistoryPoint[];
};

export type MedicationAlertType = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'EXPIRING_SOON';

export type MedicationAlert = {
  itemId: string;
  name: string;
  category: MedicationCategory;
  shelf: string | null;
  type: MedicationAlertType;
  stockQuantity: number;
  minStockThreshold: number;
  unit: string;
  missingQuantity: number;
  expiresAt: Date | null;
  predictedRunoutAt: Date | null;
  predictedUnitPrice: number | null;
};

const ROUND_FACTOR = 100;

export const MEDICATION_CATEGORY_LABELS: Record<MedicationCategory, string> = {
  CARDIO: 'Cardio',
  DIABET: 'Diabet',
  GASTRO: 'Gastro',
  RESPIRATOR: 'Respirator',
  NEURO: 'Neuro',
  PSIHIATRIC: 'Psihiatric',
  ANTIBIOTICE: 'Antibiotice',
  DURERE: 'Durere',
  ALERGII: 'Alergii',
  DERMATO: 'Dermato',
  VITAMINE: 'Vitamine',
  ALTELE: 'Altele'
};

export const MEDICATION_CATEGORIES = Object.keys(MEDICATION_CATEGORY_LABELS) as MedicationCategory[];

function toNumber(value: unknown, fallback = 0) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function round2(value: number) {
  return Math.round(value * ROUND_FACTOR) / ROUND_FACTOR;
}

export function toMedicationCategoryLabel(category: MedicationCategory) {
  return MEDICATION_CATEGORY_LABELS[category] ?? category;
}

export function estimateRunoutDate(stockQuantity: number, dailyUsage?: number | null) {
  const usage = toNumber(dailyUsage, 0);
  if (usage <= 0) return null;
  const daysLeft = Math.floor(Math.max(stockQuantity, 0) / usage);
  return new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000);
}

export function estimateNextUnitPrice(lastUnitPrice: number | null, history?: MedicationHistoryPoint[]) {
  const historyPrices = (history ?? [])
    .map((entry) => ({ unitPrice: toNumber(entry.unitPrice, 0), purchasedAt: entry.purchasedAt }))
    .filter((entry) => entry.unitPrice > 0)
    .sort((a, b) => a.purchasedAt.getTime() - b.purchasedAt.getTime());

  if (!historyPrices.length) {
    return lastUnitPrice && lastUnitPrice > 0 ? round2(lastUnitPrice) : null;
  }
  if (historyPrices.length === 1) {
    return round2(historyPrices[0].unitPrice);
  }

  const last = historyPrices[historyPrices.length - 1].unitPrice;
  const prev = historyPrices[historyPrices.length - 2].unitPrice;
  const trend = last - prev;
  const predicted = Math.max(last + trend * 0.5, 0);
  return round2(predicted);
}

export function estimateMonthlyNeed(dailyUsage?: number | null) {
  const usage = toNumber(dailyUsage, 0);
  if (usage <= 0) return null;
  return round2(usage * 30);
}

export function estimateRestockQuantity(item: Pick<MedicationProjection, 'dailyUsage' | 'stockQuantity' | 'minStockThreshold'>) {
  const monthlyNeed = estimateMonthlyNeed(item.dailyUsage);
  if (monthlyNeed === null) {
    return round2(Math.max(item.minStockThreshold - item.stockQuantity, 0));
  }
  return round2(Math.max(monthlyNeed - item.stockQuantity, 0));
}

export function calculateMedicationAlerts(items: MedicationProjection[], expiryAlertDays = 30): MedicationAlert[] {
  const alerts: MedicationAlert[] = [];
  const now = Date.now();
  const expiryWindowMs = Math.max(expiryAlertDays, 0) * 24 * 60 * 60 * 1000;

  for (const item of items) {
    const stockQuantity = toNumber(item.stockQuantity);
    const minStockThreshold = toNumber(item.minStockThreshold, 1);
    const predictedRunoutAt = estimateRunoutDate(stockQuantity, item.dailyUsage);
    const predictedUnitPrice = estimateNextUnitPrice(item.lastUnitPrice, item.purchases);
    const missingQuantity = round2(Math.max(minStockThreshold - stockQuantity, 0));

    if (item.notifyOnLowStock && stockQuantity <= 0) {
      alerts.push({
        itemId: item.id,
        name: item.name,
        category: item.category,
        shelf: item.shelf,
        type: 'OUT_OF_STOCK',
        stockQuantity,
        minStockThreshold,
        unit: item.unit,
        missingQuantity: missingQuantity || round2(minStockThreshold),
        expiresAt: item.expiresAt,
        predictedRunoutAt,
        predictedUnitPrice
      });
      continue;
    }

    if (item.notifyOnLowStock && stockQuantity <= minStockThreshold) {
      alerts.push({
        itemId: item.id,
        name: item.name,
        category: item.category,
        shelf: item.shelf,
        type: 'LOW_STOCK',
        stockQuantity,
        minStockThreshold,
        unit: item.unit,
        missingQuantity,
        expiresAt: item.expiresAt,
        predictedRunoutAt,
        predictedUnitPrice
      });
    }

    if (item.expiresAt) {
      const expiresIn = item.expiresAt.getTime() - now;
      if (expiresIn >= 0 && expiresIn <= expiryWindowMs) {
        alerts.push({
          itemId: item.id,
          name: item.name,
          category: item.category,
          shelf: item.shelf,
          type: 'EXPIRING_SOON',
          stockQuantity,
          minStockThreshold,
          unit: item.unit,
          missingQuantity,
          expiresAt: item.expiresAt,
          predictedRunoutAt,
          predictedUnitPrice
        });
      }
    }
  }

  const severity: Record<MedicationAlertType, number> = {
    OUT_OF_STOCK: 0,
    LOW_STOCK: 1,
    EXPIRING_SOON: 2
  };

  return alerts.sort((a, b) => {
    if (severity[a.type] !== severity[b.type]) return severity[a.type] - severity[b.type];
    return a.name.localeCompare(b.name);
  });
}

export function summarizeMedicationAlerts(alerts: MedicationAlert[]) {
  return alerts.reduce(
    (acc, alert) => {
      if (alert.type === 'OUT_OF_STOCK') acc.outOfStock += 1;
      if (alert.type === 'LOW_STOCK') acc.lowStock += 1;
      if (alert.type === 'EXPIRING_SOON') acc.expiringSoon += 1;
      return acc;
    },
    { outOfStock: 0, lowStock: 0, expiringSoon: 0 }
  );
}

export function formatShortDate(date: Date | null | undefined) {
  if (!date) return '-';
  return new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium' }).format(date);
}

export function formatCurrencyRon(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-';
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 2
  }).format(value);
}

export function mapPrismaMedicationItem(item: {
  id: string;
  name: string;
  category: MedicationCategory;
  shelf: string | null;
  stockQuantity: unknown;
  minStockThreshold: unknown;
  unit: string;
  dailyUsage: unknown;
  lastUnitPrice: unknown;
  lastPurchaseAt: Date | null;
  expiresAt: Date | null;
  notifyOnLowStock: boolean;
  purchases?: Array<{ unitPrice: unknown; purchasedAt: Date }>;
}) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    shelf: item.shelf,
    stockQuantity: toNumber(item.stockQuantity),
    minStockThreshold: toNumber(item.minStockThreshold, 1),
    unit: item.unit,
    dailyUsage: item.dailyUsage === null || item.dailyUsage === undefined ? null : toNumber(item.dailyUsage),
    lastUnitPrice: item.lastUnitPrice === null || item.lastUnitPrice === undefined ? null : toNumber(item.lastUnitPrice),
    lastPurchaseAt: item.lastPurchaseAt,
    expiresAt: item.expiresAt,
    notifyOnLowStock: item.notifyOnLowStock,
    purchases: (item.purchases ?? []).map((entry) => ({
      unitPrice: entry.unitPrice === null || entry.unitPrice === undefined ? null : toNumber(entry.unitPrice),
      purchasedAt: entry.purchasedAt
    }))
  } satisfies MedicationProjection;
}
