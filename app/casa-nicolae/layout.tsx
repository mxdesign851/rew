import Link from 'next/link';
import { requireUser } from '@/lib/session';

export default async function CasaNicolaeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  const navItems = [
    { href: '/casa-nicolae', label: 'Dashboard' },
    { href: '/casa-nicolae/medicament', label: 'Hub Medicamente' },
    { href: '/casa-nicolae/beneficiari', label: 'Beneficiari' },
    { href: '/casa-nicolae/notificari', label: 'Notificări' }
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-emerald-800/50 bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/casa-nicolae" className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-400">Casa Nicolae</span>
              <span className="text-sm text-slate-400">– Aplicație internă</span>
            </Link>
            <Link
              href="/app"
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              ← App principal
            </Link>
          </div>
          <nav className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
