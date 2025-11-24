import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  patient: { nom: string; prenom: string };
  doctor: { nom: string };
  date: string;
  heure: string;
  statut: string;
};

export default function ReceptionDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments?today=1") // Crée/toEdit cette route pour n’afficher que les rdv du jour/recent!
      .then((r) => r.json())
      .then((d) => {
        setAppointments(d.appointments || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-56 bg-blue-800 text-white flex flex-col h-screen fixed">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-blue-700">
          MedFlow
        </div>
        <nav className="flex-1 mt-4 flex flex-col space-y-2 px-4">
          <a href="/receptionist/dashboard" className="p-2 hover:bg-blue-700 rounded">🏠 Accueil</a>
          <a href="/receptionist/patients" className="p-2 hover:bg-blue-700 rounded">👥 Patients</a>
          <a href="/receptionist/appointments" className="p-2 hover:bg-blue-700 rounded">📅 Rendez-vous</a>
          {/* ...autres liens */}
        </nav>
        <button className="m-4 p-2 bg-blue-700 hover:bg-blue-600 rounded">Se déconnecter</button>
      </aside>
      <main className="ml-56 flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Dashboard Réception</h1>

        {/* Bloc info rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow text-center">
            <div className="text-4xl font-bold">{appointments.filter(ap => ap.statut === "En attente").length}</div>
            <div className="uppercase text-xs mt-2">RDV en attente</div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow text-center">
            <div className="text-4xl font-bold">{appointments.filter(ap => ap.statut === "Confirmé").length}</div>
            <div className="uppercase text-xs mt-2">RDV confirmés</div>
          </div>
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow text-center">
            <div className="text-4xl font-bold">{appointments.length}</div>
            <div className="uppercase text-xs mt-2">Total RDV aujourd’hui</div>
          </div>
        </div>
        {/* Liste des RDV du jour */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-blue-700">RDV du jour</h2>
          {loading ?
            <div>Chargement...</div>
            : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Médecin</th>
                    <th className="p-3">Heure</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((ap) => (
                    <tr key={ap.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{ap.patient?.nom} {ap.patient?.prenom}</td>
                      <td className="p-3">{ap.doctor?.nom}</td>
                      <td className="p-3">{ap.heure}</td>
                      <td className="p-3">
                        <span className={
                          `px-3 py-1 rounded-full text-xs font-semibold ${ap.statut === "Confirmé"
                            ? "bg-green-100 text-green-800"
                            : ap.statut === "Annulé"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"}`
                        }>
                          {ap.statut}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="bg-green-500 hover:bg-green-700 text-white px-2 rounded mr-2">
                          Valider
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white px-2 rounded">
                          Annuler
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </main>
    </div>
  );
}
