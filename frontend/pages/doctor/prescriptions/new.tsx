// pages/doctor/prescriptions/new.tsx
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewPrescriptionPage() {
  const router = useRouter();
  const { patientId, appointmentId } = router.query;

  const [form, setForm] = useState({
    medicaments: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setMsg("Patient manquant.");
      return;
    }
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/doctors/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: Number(patientId),
        appointmentId: appointmentId ? Number(appointmentId) : null,
        medicaments: form.medicaments,
        notes: form.notes,
      }),
    });

    if (res.ok) {
      // Retour au dossier patient
      router.push(`/doctor/patients/${patientId}`);
    } else {
      const err = await res.json().catch(() => ({}));
      setMsg(err.error || "Erreur lors de la création de l’ordonnance");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-60 bg-blue-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-800">
          MedFlow
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/doctor" className="block px-3 py-2 rounded hover:bg-blue-800">
            Dashboard
          </a>
          <a href="/doctor/patients" className="block px-3 py-2 rounded hover:bg-blue-800">
            Dossiers patients
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <button
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
          onClick={() => router.back()}
        >
          ← Retour
        </button>

        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Nouvelle ordonnance
        </h1>

        {msg && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {msg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded p-6 max-w-xl space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">
              Médicaments (liste, posologie, durée)
            </label>
            <textarea
              name="medicaments"
              className="border rounded w-full p-2 h-40"
              value={form.medicaments}
              onChange={handleChange}
              required
              placeholder="Par ex : Paracétamol 500mg, 1 comprimé 3 fois par jour pendant 5 jours..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Notes / recommandations
            </label>
            <textarea
              name="notes"
              className="border rounded w-full p-2 h-24"
              value={form.notes}
              onChange={handleChange}
              placeholder="Conseils au patient, suivi, etc."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white font-bold px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer l’ordonnance"}
          </button>
        </form>
      </main>
    </div>
  );
}
