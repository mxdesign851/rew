import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { Package, Users, Bell } from 'lucide-react';

export default async function CasaNicolaeDashboard() {
  const [beneficiaryCount, medications, unreadNotifications] = await Promise.all([
    prisma.beneficiary.count(),
    prisma.medication.findMany(),
    prisma.medicationNotification.count({ where: { isRead: false } })
  ]);
  const lowStockCount = medications.filter((m) => m.quantity <= m.minQuantity).length;
  const medicationCount = medications.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Dashboard Casa Nicolae</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/casa-nicolae/beneficiari"
          className="card flex items-center gap-4 p-4 transition hover:border-emerald-700/50"
        >
          <div className="rounded-lg bg-emerald-500/20 p-3">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Beneficiari</p>
            <p className="text-2xl font-bold text-slate-100">{beneficiaryCount}</p>
          </div>
        </Link>

        <Link
          href="/casa-nicolae/medicament"
          className="card flex items-center gap-4 p-4 transition hover:border-emerald-700/50"
        >
          <div className="rounded-lg bg-blue-500/20 p-3">
            <Package className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Medicamente în inventar</p>
            <p className="text-2xl font-bold text-slate-100">{medicationCount}</p>
          </div>
        </Link>

        <Link
          href="/casa-nicolae/medicament?alert=low"
          className="card flex items-center gap-4 p-4 transition hover:border-amber-700/50"
        >
          <div className="rounded-lg bg-amber-500/20 p-3">
            <Package className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Stoc insuficient</p>
            <p className="text-2xl font-bold text-amber-400">{lowStockCount}</p>
          </div>
        </Link>

        <Link
          href="/casa-nicolae/notificari"
          className="card flex items-center gap-4 p-4 transition hover:border-emerald-700/50"
        >
          <div className="rounded-lg bg-violet-500/20 p-3">
            <Bell className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Notificări necitite</p>
            <p className="text-2xl font-bold text-slate-100">{unreadNotifications}</p>
          </div>
        </Link>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Acțiuni rapide</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/casa-nicolae/beneficiari/nou"
            className="btn btn-primary rounded-lg"
          >
            + Beneficiar nou
          </Link>
          <Link
            href="/casa-nicolae/medicament"
            className="btn btn-secondary rounded-lg"
          >
            Vezi inventar medicamente
          </Link>
          <Link
            href="/casa-nicolae/medicament?pdf=list"
            className="btn btn-secondary rounded-lg"
          >
            Descarcă listă PDF medicamente
          </Link>
        </div>
      </div>
    </div>
  );
}
