'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Pill,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Hub Principal', icon: Home },
  { href: '/medicamente', label: 'Medicamente', icon: Pill },
  { href: '/profil', label: 'Profile Psihosociale', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-slate-200"
        aria-label="Deschide meniul"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50
          flex flex-col shadow-sm
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="p-5 border-b border-slate-200">
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 rounded hover:bg-slate-100"
            aria-label="Inchide meniul"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
          <h1 className="text-lg font-bold text-brand-800">Casa Nicolae</h1>
          <p className="text-xs text-slate-500 mt-0.5">Hub Intern</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 text-center">
            Aplicatie interna &bull; Date confidentiale
          </p>
        </div>
      </aside>
    </>
  );
}
