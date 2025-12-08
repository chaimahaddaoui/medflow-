// pages/doctor/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type TodayAppointment = {
  id: number;
  patient: string;
  heure: string;
  statut: "En attente" | "Confirmé" | "Annulé";
};

type DoctorDashboardData = {
  rdvEnAttente: number;
  rdvConfirmes: number;
  totalRdvAujourdhui: number;
  rdvDuJour: TodayAppointment[];
};

export default function DoctorDashboard() {
  const [data, setData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/doctors/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur dashboard docteur:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Erreur logout:", e);
    }
    // plus tard : localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!data) return <div className="p-8">Aucune donnée.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar – même style que réception mais pour le rôle médecin */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-800">
          MedFlow
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="/doctor"
            className="block px-3 py-2 rounded bg-blue-800"
          >
            Accueil
          </a>
          <a
            href="/doctor/patients"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Dossiers patients
          </a>
          <a
            href="/doctor/agenda"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Agenda
          </a>
          <a
            href="/doctor/appointments/new"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Rendez-vous
          </a>

          <a
            href="/doctor/prescriptions"
            className="block px-3 py-2 rounded hover:bg-blue-800"
          >
            Ordonnances
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 mt-auto bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Se déconnecter
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Dashboard Docteur
        </h1>

        {/* 3 cartes statistiques – même type que réception */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 rounded shadow p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">RDV EN ATTENTE</p>
            <p className="text-4xl font-bold text-green-700">
              {data.rdvEnAttente}
            </p>
          </div>

          <div className="bg-yellow-100 rounded shadow p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">RDV CONFIRMÉS</p>
            <p className="text-4xl font-bold text-yellow-700">
              {data.rdvConfirmes}
            </p>
          </div>

          <div className="bg-blue-100 rounded shadow p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              TOTAL RDV AUJOURD&apos;HUI
            </p>
            <p className="text-4xl font-bold text-blue-700">
              {data.totalRdvAujourdhui}
            </p>
          </div>
        </div>

        {/* Tableau RDV du jour = gestion d’agenda */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-blue-900">
            RDV du jour
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Heure</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rdvDuJour.map((rdv) => (
                <tr key={rdv.id} className="border-b">
                  <td className="p-3">{rdv.patient}</td>
                  <td className="p-3">{rdv.heure}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rdv.statut === "Confirmé"
                          ? "bg-green-100 text-green-700"
                          : rdv.statut === "Annulé"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rdv.statut}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {/* Dossier médical */}
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() =>
                        (window.location.href = `/doctor/patients/${rdv.id}`)
                      }
                    >
                      Dossier médical
                    </button>
                    {/* Ordonnance */}
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() =>
                        (window.location.href = `/doctor/prescriptions/new?appointmentId=${rdv.id}`)
                      }
                    >
                      Ordonnance
                    </button>
                  </td>
                </tr>
              ))}
              {data.rdvDuJour.length === 0 && (
                <tr>
                  <td
                    className="p-3 text-center text-gray-500"
                    colSpan={4}
                  >
                    Aucun rendez-vous pour aujourd&apos;hui.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
