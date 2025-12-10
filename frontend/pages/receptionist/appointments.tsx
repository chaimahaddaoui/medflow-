// pages/receptionist/appointments
import Link from "next/link";
import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  patient: { nom: string; prenom: string };
  doctor: { nom: string };
  date: string;
  heure: string;
  statut: string;
  billId?: number | null;
  billStatut?: string | null;
};

export default function AppointmentsReception() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [msg, setMsg] = useState("");

  const fetchAppointments = () => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .catch(() =>
        setMsg("Erreur lors du chargement des rendez-vous.")
      );
  };

  useEffect(fetchAppointments, []);

  const handlePayBill = async (billId: number | null | undefined) => {
    if (!billId) return;

    try {
      const res = await fetch(`/api/receptionists/bills/${billId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statut: "Payée",
          modePaiement: "Espèces", 
        }),
      });

      if (!res.ok) {
        setMsg("Erreur lors de l'encaissement de la facture.");
        return;
      }

      fetchAppointments(); // recharger la liste après encaissement
    } catch (e) {
      console.error("Erreur encaissement facture:", e);
      setMsg("Erreur lors de l'encaissement de la facture.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/receptionist">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
        <h1 className="text-2xl font-bold text-blue-900">Rendez-vous</h1>
        <a
          href="/receptionist/appointments/new"
          className="bg-blue-700 text-white font-bold px-4 py-2 rounded shadow hover:bg-blue-800"
        >
          + Nouveau rendez-vous
        </a>
      </div>

      {msg && <div className="mb-4 text-red-600 font-bold">{msg}</div>}

      <table className="w-full text-left text-sm shadow bg-white rounded">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-3">Patient</th>
            <th className="p-3">Médecin</th>
            <th className="p-3">Date</th>
            <th className="p-3">Heure</th>
            <th className="p-3">Statut</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((ap) => (
            <tr key={ap.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {ap.patient?.nom} {ap.patient?.prenom}
              </td>
              <td className="p-3">{ap.doctor?.nom}</td>
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
              <td className="p-3 text-right space-x-2">
                {/* Bouton Encaisser si une facture existe */}
                {ap.billId && ap.billStatut !== "Payée" && (
                  <button
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handlePayBill(ap.billId)}
                  >
                    Encaisser
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
