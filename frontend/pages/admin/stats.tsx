import { useEffect, useState } from 'react';

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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Statistiques administrateur</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 shadow rounded">
          <div className="text-gray-500 text-sm">Patients</div>
          <div className="text-3xl font-bold">{stats.totalPatients}</div>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <div className="text-gray-500 text-sm">Médecins</div>
          <div className="text-3xl font-bold">{stats.totalDoctors}</div>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <div className="text-gray-500 text-sm">Revenus (total €)</div>
          <div className="text-3xl font-bold">{stats.totalRevenu}</div>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <div className="text-gray-500 text-sm">RDV ce mois</div>
          <div className="text-3xl font-bold">{stats.rdvThisMonth}</div>
        </div>
      </div>

      {/* Exemples de graphiques simples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h3 className="font-bold mb-2">Répartition des statuts RDV</h3>
          {/* Ajoute ici un graphique avec Chart.js, Recharts, ou donne juste les % */}
          <table className="w-full text-sm mt-4">
            <tbody>
              {Object.entries(stats.rdvParStatut).map(([statut, count]) => (
                <tr key={statut}>
                  <td>{statut}</td>
                  <td className="text-right">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h3 className="font-bold mb-2">Revenus par mois (dernier an)</h3>
          {/* Ici tu peux intégrer un graphique, ou un tableau */}
          <table className="w-full text-sm mt-4">
            <tbody>
              {Object.entries(stats.revenuParMois).map(([mois, chiffre]) => (
                <tr key={mois}>
                  <td>{mois}</td>
                  <td className="text-right">{chiffre} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
