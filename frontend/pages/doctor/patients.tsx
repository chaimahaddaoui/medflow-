// pages/doctor/patients.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

type DoctorPatient = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  dateNaissance: string;
};

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data.patients ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement patients médecin:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* BOUTON RETOUR */}
    <div className="mb-6">
      
    </div>
      {/* Sidebar simplifiée, identique au dashboard doctor */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-800">
          MedFlow
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/doctor" className="block px-3 py-2 rounded hover:bg-blue-800">
            Dashboard
          </a>
          <a href="/doctor/patients" className="block px-3 py-2 rounded bg-blue-800">
            Dossiers patients
          </a>
          <a href="/doctor/appointments" className="block px-3 py-2 rounded hover:bg-blue-800">
            Agenda
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Dossiers patients
        </h1>
<Link href="/doctor">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="bg-white shadow rounded p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-3 text-left">Nom</th>
                  <th className="p-3 text-left">Prénom</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Téléphone</th>
                  <th className="p-3 text-left">Date naissance</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.nom}</td>
                    <td className="p-3">{p.prenom}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.telephone || "-"}</td>
                    <td className="p-3">
                      {new Date(p.dateNaissance).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-3">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() =>
                          (window.location.href = `/doctor/patients/${p.id}`)
                        }
                      >
                        Voir dossier
                      </button>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td className="p-3 text-center text-gray-500" colSpan={6}>
                      Aucun patient trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
