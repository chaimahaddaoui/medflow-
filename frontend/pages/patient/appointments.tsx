import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  doctor: { nom: string };
  date: string;
  heure: string;
  statut: string;
};

export default function PatientAppointmentsPage() {
  // TODO : remplacer par l'id du patient connecté (auth plus tard)
  const patientId = 1;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [msg, setMsg] = useState("");

  const fetchAppointments = () => {
    fetch(`/api/appointments?patientId=${patientId}`)
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .catch(() =>
        setMsg("Erreur lors du chargement de vos rendez-vous.")
      );
  };

  useEffect(fetchAppointments, [patientId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">
        Mes rendez-vous
      </h1>

      {msg && <div className="mb-4 text-red-600 font-bold">{msg}</div>}

      <table className="w-full text-left text-sm shadow bg-white rounded">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-3">Médecin</th>
            <th className="p-3">Date</th>
            <th className="p-3">Heure</th>
            <th className="p-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((ap) => (
            <tr key={ap.id} className="border-b hover:bg-gray-50">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
