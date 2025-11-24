// pages/receptionist/appointments/new.tsx
import { useEffect, useState } from "react";
type Patient = { id: number; nom: string; prenom: string; };
type Doctor = { id: number; nom: string; };

export default function NewAppointmentReception() {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    heure: '',
    statut: 'En attente'
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch("/api/patients").then(r => r.json()).then(d => setPatients(d.patients ?? []));
    fetch("/api/doctors").then(r => r.json()).then(d => setDoctors(d.doctors ?? []));
  }, []);

  const handleChange = (e: any) => 
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId)
      }),
    });
    window.location.href = "/receptionist/appointments";
  };

  // Rafraîchir la liste des patients
  const refreshPatients = () => {
    fetch("/api/patients")
      .then(r => r.json())
      .then(d => setPatients(d.patients ?? []));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-blue-800">Nouveau Rendez-vous</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Bloc select patients + bouton ajout */}
        <div className="flex items-center">
          <select
            name="patientId"
            required
            className="border p-2 rounded flex-1"
            value={form.patientId}
            onChange={handleChange}
          >
            <option value="">Sélectionner un patient</option>
            {patients.map(p => (
              <option value={p.id} key={p.id}>{p.nom} {p.prenom}</option>
            ))}
          </select>
          <a
            href="/receptionist/patients/new"
            target="_blank"
            rel="noopener"
            className="ml-2 text-blue-700 underline font-bold hover:text-blue-900 text-sm"
          >
            + Nouveau patient
          </a>
          <button
            type="button"
            onClick={refreshPatients}
            className="ml-2 px-2 py-1 text-xs bg-blue-100 rounded hover:bg-blue-200"
            title="Rafraîchir la liste"
          >↻</button>
        </div>
        {/* Sélection médecin */}
        <select
          name="doctorId"
          required
          className="border p-2 rounded w-full"
          value={form.doctorId}
          onChange={handleChange}
        >
          <option value="">Sélectionner un médecin</option>
          {doctors.map(d => (
            <option value={d.id} key={d.id}>{d.nom}</option>
          ))}
        </select>
        <input
          name="date"
          required
          type="date"
          className="border p-2 rounded w-full"
          value={form.date}
          onChange={handleChange}
        />
        <input
          name="heure"
          required
          type="time"
          className="border p-2 rounded w-full"
          value={form.heure}
          onChange={handleChange}
        />
        <button className="bg-green-700 text-white font-bold px-4 py-2 rounded mt-2">
          Créer RDV
        </button>
      </form>
    </div>
  );
}
