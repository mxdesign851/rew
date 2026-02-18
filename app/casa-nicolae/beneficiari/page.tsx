import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { UserPlus, FileText } from 'lucide-react';

export default async function BeneficiariPage() {
  const beneficiaries = await prisma.beneficiary.findMany({
    orderBy: { evaluationDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-100">Beneficiari</h1>
        <Link
          href="/casa-nicolae/beneficiari/nou"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Beneficiar nou
        </Link>
      </div>

      {beneficiaries.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16">
          <p className="mb-4 text-slate-400">Niciun beneficiar înregistrat</p>
          <Link href="/casa-nicolae/beneficiari/nou" className="btn btn-primary">
            Adaugă primul beneficiar
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">
                    Prenume/Cod
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">
                    Vârstă
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">
                    Locație
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">
                    Responsabil
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">
                    Evaluare
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 text-slate-200">{b.firstName}</td>
                    <td className="px-4 py-3 text-slate-400">{b.age}</td>
                    <td className="px-4 py-3 text-slate-400">{b.location}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {b.responsiblePerson}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(b.evaluationDate).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/casa-nicolae/beneficiari/${b.id}`}
                        className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        Profil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
