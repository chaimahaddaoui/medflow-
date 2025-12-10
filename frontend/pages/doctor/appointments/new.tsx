// pages/doctor/appointments/new.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  patient: { nom: string; prenom: string };
  date: string;
  heure: string;
  statut: string;
};

export default function DoctorAppointmentsPage() {
  // TODO : remplacer par l'id du médecin connecté via authentification
  const doctorId = 1;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [msg, setMsg] = useState("");

  const fetchAppointments = () => {
    fetch(`/api/appointments?doctorId=${doctorId}`)
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .catch(() =>
        setMsg("Erreur lors du chargement des rendez-vous du médecin.")
      );
  };

  useEffect(fetchAppointments, [doctorId]);

  const updateStatus = async (id: number, statut: string) => {
    setMsg("");
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    if (res.ok) {
      fetchAppointments();
    } else {
      const err = await res.json().catch(() => ({}));
      setMsg(err.error || "Erreur : la modification n'a pas pu être enregistrée.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">
        Mes rendez-vous
      </h1>

      {msg && <div className="mb-4 text-red-600 font-bold">{msg}</div>}

      <table className="w-full text-left text-sm shadow bg-white rounded">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-3">Patient</th>
            <th className="p-3">Date</th>
            <th className="p-3">Heure</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((ap) => (
            <tr key={ap.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {ap.patient?.nom} {ap.patient?.prenom}
              </td>
              <td className="p-3">
                {new Date(ap.date).toLocaleDateString("fr-FR")}
              </td>
              <td className="p-3">{ap.heure}</td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ap.statut === "Confirmé"
                      ? "bg-green-100 text-green-800"
                      : ap.statut === "Annulé"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {ap.statut}
                </span>
              </td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => updateStatus(ap.id, "Confirmé")}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                  disabled={ap.statut === "Confirmé"}
                >
                  Valider
                </button>
                <button
                  onClick={() => updateStatus(ap.id, "Annulé")}
                  className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                  disabled={ap.statut === "Annulé"}
                >
                  Annuler
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/doctor">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
    </div>
  );
}
