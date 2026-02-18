import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { MEDICATION_CATEGORIES } from '@/lib/casa-nicolae';
import { ensureMedicationCategories } from '@/lib/casa-nicolae-db';
import { Package, Download, Plus, AlertTriangle } from 'lucide-react';

export default async function HubMedicamentePage() {
  await ensureMedicationCategories();
  const categories = await prisma.medicationCategory.findMany({
    include: { medications: true },
    orderBy: { type: 'asc' }
  });

  // Ensure categories exist - if empty, we show default list
  const categoryMap = new Map(categories.map((c) => [c.type, c]));
  const allCategories = MEDICATION_CATEGORIES.map((cat) => ({
    ...cat,
    medications: categoryMap.get(cat.type)?.medications ?? []
  }));

  const lowStock = allCategories.flatMap((c) =>
    c.medications.filter((m) => m.quantity <= m.minQuantity)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-100">Hub Medicamente</h1>
        <div className="flex gap-2">
          <Link
            href="/casa-nicolae/medicament/adauga"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adaugă medicament
          </Link>
          <a
            href="/api/casa-nicolae/medicament/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Descarcă PDF
          </a>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="card flex items-center gap-3 border-amber-700/50 bg-amber-900/20 p-4">
          <AlertTriangle className="h-6 w-6 shrink-0 text-amber-400" />
          <div>
            <p className="font-medium text-amber-200">
              {lowStock.length} medicament(e) cu stoc insuficient
            </p>
            <p className="text-sm text-slate-400">
              {lowStock.map((m) => m.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {allCategories.map((cat) => (
          <div key={cat.type} className="card overflow-hidden">
            <div className="border-b border-slate-700 bg-slate-800/50 px-4 py-3">
              <h2 className="font-semibold text-slate-100">{cat.name}</h2>
              <p className="text-xs text-slate-400">
                {cat.medications.length} medicament(e)
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto p-4">
              {cat.medications.length === 0 ? (
                <p className="text-sm text-slate-500">Niciun medicament</p>
              ) : (
                <ul className="space-y-2">
                  {cat.medications.map((m) => {
                    const isLow = m.quantity <= m.minQuantity;
                    return (
                      <li
                        key={m.id}
                        className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-200">{m.name}</span>
                          {isLow && (
                            <span className="badge border-amber-600 bg-amber-900/40 text-amber-300">
                              Stoc mic
                            </span>
                          )}
                        </div>
                        <span
                          className={
                            isLow ? 'text-amber-400' : 'text-slate-400'
                          }
                        >
                          {m.quantity} {m.unit}
                        </span>
                        <Link
                          href={`/casa-nicolae/medicament/${m.id}/editeaza`}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          Editează
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
