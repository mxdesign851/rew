import { prisma } from '@/lib/prisma';
import { MEDICATION_CATEGORIES } from './casa-nicolae';
import type { MedicationCategoryType } from '@prisma/client';

export async function ensureMedicationCategories() {
  const existing = await prisma.medicationCategory.count();
  if (existing > 0) return;

  await prisma.medicationCategory.createMany({
    data: MEDICATION_CATEGORIES.map((c) => ({
      type: c.type as MedicationCategoryType,
      name: c.name
    })),
    skipDuplicates: true
  });
}
