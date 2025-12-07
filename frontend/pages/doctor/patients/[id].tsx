// pages/doctor/patients/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type PatientInfo = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  dateNaissance: string;
  adresse?: string | null;
};

type AppointmentInfo = {
  id: number;
  date: string;
  status: string | null;
  motif?: string | null;
};

type PrescriptionInfo = {
  id: number;
  createdAt: string;
  medicaments: string;
  notes?: string | null;
};

type DossierData = {
  patient: PatientInfo;
  appointments: AppointmentInfo[];
  prescriptions: PrescriptionInfo[];
};

export default function DoctorPatientDossier() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<DossierData | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingPrescriptionId, setEditingPrescriptionId] = useState<number | null>(null);
  const [editPrescription, setEditPrescription] = useState({
    medicaments: "",
    notes: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/doctors/patients/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement dossier patient:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!data) return <div className="p-8">Dossier introuvable.</div>;

  const { patient, appointments, prescriptions } = data;

  const startEditPrescription = (p: PrescriptionInfo) => {
    setEditingPrescriptionId(p.id);
    setEditPrescription({
      medicaments: p.medicaments,
      notes: p.notes || "",
    });
  };

  const handleEditPrescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditPrescription((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const savePrescription = async () => {
    if (!editingPrescriptionId) return;
    const res = await fetch(`/api/doctors/prescriptions/${editingPrescriptionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPrescription),
    });
    if (res.ok) {
      const d = await fetch(`/api/doctors/patients/${id}`).then((r) => r.json());
      setData(d);
      setEditingPrescriptionId(null);
    }
  };

  const deletePrescription = async (prescriptionId: number) => {
    if (!confirm("Supprimer cette ordonnance ?")) return;
    const res = await fetch(`/api/doctors/prescriptions/${prescriptionId}`, {
      method: "DELETE",
    });
    if (res.ok || res.status === 204) {
      setData((prev) =>
        prev
          ? {
              ...prev,
              prescriptions: prev.prescriptions.filter((p) => p.id !== prescriptionId),
            }
          : prev
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
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

      <main className="flex-1 p-8 space-y-6">
        <button
          className="mb-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
          onClick={() => router.back()}
        >
          ← Retour
        </button>

        {/* Informations patient */}
        <section className="bg-white shadow rounded p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Dossier de {patient.prenom} {patient.nom}
          </h1>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-semibold">Email :</span> {patient.email}
              </p>
              <p>
                <span className="font-semibold">Téléphone :</span>{" "}
                {patient.telephone || "-"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Date de naissance :</span>{" "}
                {new Date(patient.dateNaissance).toLocaleDateString("fr-FR")}
              </p>
              <p>
                <span className="font-semibold">Adresse :</span>{" "}
                {patient.adresse || "-"}
              </p>
            </div>
          </div>
        </section>

        {/* Historique des rendez-vous */}
        <section className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-blue-900">
              Historique des consultations
            </h2>
            <button
              className="bg-green-700 text-white px-3 py-1 rounded text-sm"
              onClick={() =>
                router.push(`/doctor/appointments/new?patientId=${patient.id}`)
              }
            >
              Nouveau rendez-vous
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Motif</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-3">
                    {new Date(a.date).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">{a.status || "-"}</td>
                  <td className="p-3">{(a as any).motif || "-"}</td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={3}>
                    Aucune consultation pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Ordonnances */}
        <section className="bg-white shadow rounded p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-blue-900">Ordonnances</h2>
            <button
              className="bg-blue-700 text-white px-3 py-1 rounded text-sm"
              onClick={() =>
                router.push(`/doctor/prescriptions/new?patientId=${patient.id}`)
              }
            >
              Nouvelle ordonnance
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune ordonnance pour le moment.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Médicaments</th>
                  <th className="p-3 text-left">Notes</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p) => {
                  const isEditing = editingPrescriptionId === p.id;
                  return (
                    <tr key={p.id} className="border-b align-top">
                      <td className="p-3">
                        {new Date(p.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-3 whitespace-pre-line">
                        {isEditing ? (
                          <textarea
                            name="medicaments"
                            className="border rounded w-full p-2 h-24"
                            value={editPrescription.medicaments}
                            onChange={handleEditPrescriptionChange}
                          />
                        ) : (
                          p.medicaments
                        )}
                      </td>
                      <td className="p-3 whitespace-pre-line">
                        {isEditing ? (
                          <textarea
                            name="notes"
                            className="border rounded w-full p-2 h-20"
                            value={editPrescription.notes}
                            onChange={handleEditPrescriptionChange}
                          />
                        ) : (
                          p.notes || "-"
                        )}
                      </td>
                      <td className="p-3 space-y-2">
                        {isEditing ? (
                          <>
                            <button
                              className="bg-green-700 text-white px-3 py-1 rounded text-xs block w-full"
                              onClick={savePrescription}
                            >
                              Enregistrer
                            </button>
                            <button
                              className="bg-gray-400 text-white px-3 py-1 rounded text-xs block w-full"
                              onClick={() => setEditingPrescriptionId(null)}
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs block w-full mb-1"
                              onClick={() => startEditPrescription(p)}
                            >
                              Modifier
                            </button>
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs block w-full"
                              onClick={() => deletePrescription(p.id)}
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
