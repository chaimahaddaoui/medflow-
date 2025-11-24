import { useEffect, useState } from 'react';

type StatsData = {
  totalPatients: number;
  appointmentsToday: number;
  totalDoctors: number;
  totalRevenue: number;
  recentAppointments: Array<{
    id: string;
    patient: string;
    doctor: string;
    date: string;
    time: string;
    status: string;
  }>;
  notifications: string[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-bold">Chargement des données...</div>
      </div>
    );
  }

  if (!stats) {
    return <div>Erreur de chargement</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-indigo-800 text-white flex flex-col fixed h-screen shadow-lg">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-blue-700">
          MedFlow
        </div>
        <nav className="flex-1 mt-4 flex flex-col space-y-2 px-4">
          <a href="/admin" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">📊 Dashboard</a>
          <a href="/admin/clinics" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">🏥 Cliniques</a>
          <a href="/admin/patients" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">👥 Patients</a>
          <a href="/admin/doctors" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">🩺 Médecins</a>
          <a href="/admin/appointments" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">📅 Rendez-vous</a>
          <a href="/admin/bills" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">💰 Factures</a>
          <a href="/admin/stats" className="p-2 hover:bg-blue-700 rounded flex items-center gap-2">📈 Statistiques</a>
        </nav>
        <button className="m-4 p-2 bg-blue-700 hover:bg-blue-600 rounded font-bold">Se déconnecter</button>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b shadow-sm">
          <div className="text-lg font-bold">Dashboard Admin</div>
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Recherche…" className="border px-3 py-1 rounded" />
            <span className="text-yellow-500 text-xl">🔔</span>
            <span className="font-medium">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6 rounded-xl shadow-xl text-white flex flex-col items-center">
              <span className="text-3xl mb-2">👥</span>
              <div className="text-sm uppercase tracking-wider opacity-80">Patients</div>
              <div className="text-3xl font-extrabold mt-2">{stats.totalPatients}</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 rounded-xl shadow-xl text-white flex flex-col items-center">
              <span className="text-3xl mb-2">📅</span>
              <div className="text-sm uppercase tracking-wider opacity-80">RDV auj.</div>
              <div className="text-3xl font-extrabold mt-2">{stats.appointmentsToday}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-6 rounded-xl shadow-xl text-white flex flex-col items-center">
              <span className="text-3xl mb-2">🩺</span>
              <div className="text-sm uppercase tracking-wider opacity-80">Médecins</div>
              <div className="text-3xl font-extrabold mt-2">{stats.totalDoctors}</div>
            </div>
            <div className="bg-gradient-to-r from-green-700 to-green-500 p-6 rounded-xl shadow-xl text-white flex flex-col items-center">
              <span className="text-3xl mb-2">💰</span>
              <div className="text-sm uppercase tracking-wider opacity-80">Revenus</div>
              <div className="text-3xl font-extrabold mt-2">{stats.totalRevenue} dt</div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg mb-8 p-6">
            <div className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700">🔔 Notifications</div>
            <ul className="text-sm text-gray-700 space-y-2">
              {stats.notifications.map((notif, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 pl-2 border-l-4 border-blue-300"
                >
                  <span className="text-blue-500">•</span>
                  <span>{notif}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-blue-700">Prochains rendez-vous</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Médecin</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Heure</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((appt) => (
                    <tr key={appt.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{appt.patient}</td>
                      <td className="p-3">{appt.doctor}</td>
                      <td className="p-3">{appt.date}</td>
                      <td className="p-3">{appt.time}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appt.status === 'Confirmé'
                              ? 'bg-green-100 text-green-800'
                              : appt.status === 'Annulé'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
