import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Casa Nicolae - Hub Intern',
  description: 'Aplicatie interna pentru gestionarea medicamentelor si profilurilor psihosociale',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="antialiased min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
