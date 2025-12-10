import { useEffect, useState } from 'react';
import {
  UserGroupIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import Link from 'next/link';

interface Stats {
  totalPatients: number;
  totalDoctors: number;
  totalRevenu: number;
  rdvThisMonth: number;
  rdvParStatut: Record<string, number>;
  revenuParMois: Record<string, number>;
}

export default function StatisticsAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/statistics')
      .then(r => r.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div className="p-8">Chargement…</div>;

  const cards = [
    {
      label: "Patients",
      value: stats.totalPatients,
      icon: <UserGroupIcon className="h-8 w-8 text-blue-600" />
    },
    {
      label: "Médecins",
      value: stats.totalDoctors,
      icon: <UserIcon className="h-8 w-8 text-green-600" />
    },
    {
      label: "Revenus (DT)",
      value: stats.totalRevenu,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
    },
    {
      label: "RDV ce mois",
      value: stats.rdvThisMonth,
      icon: <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">📊 Tableau de bord - Statistiques</h2>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-gray-100">
              {c.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{c.label}</p>
              <p className="text-3xl font-bold text-gray-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPHIQUES / TABLEAUX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* RDV PAR STATUT */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Répartition des statuts des RDV
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(stats.rdvParStatut).map(([statut, count]) => (
                <tr key={statut} className="border-b last:border-none">
                  <td className="p-2 font-medium text-gray-600">{statut}</td>
                  <td className="p-2 text-right font-bold text-gray-800">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>

        {/* REVENUS PAR MOIS */}
        <div className="bg-white rounded-2xl p-6 shadow">
          {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/admin">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Revenus par mois (12 derniers mois)
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(stats.revenuParMois).map(([mois, chiffre]) => (
                <tr key={mois} className="border-b last:border-none">
                  <td className="p-2 capitalize text-gray-600">{mois}</td>
                  <td className="p-2 text-right font-bold text-gray-800">{chiffre} DT</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>

      </div>
    </div>
  );
}
