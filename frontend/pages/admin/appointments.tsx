import { useEffect, useState } from "react";
import Link from "next/link";


type Appointment = {
  id: number;
  date: string;
  heure: string;
  statut: string;
  patient: { id: number; nom: string; prenom: string };
  doctor: { id: number; nom: string; prenom: string };
  patientId: number;
  doctorId: number;
};

// Pour les listes déroulantes :
type Patient = { id: number; nom: string; prenom: string }
type Doctor = { id: number; nom: string; prenom: string }

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ date: '', heure: '', statut: 'Confirmé', patientId: '', doctorId: '' });
  const [editingId, setEditingId] = useState<number|null>(null);

  useEffect(() => {
    fetch('/api/appointments').then(res => res.json()).then(data => setAppointments(data.appointments));
    fetch('/api/patients').then(res => res.json()).then(data => setPatients(data.patients));
    fetch('/api/doctors').then(res => res.json()).then(data => setDoctors(data.doctors));
  }, []);

  const addAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setAppointments(a => [...a, { ...data.appointment, patient: patients.find(p => p.id == Number(form.patientId))!, doctor: doctors.find(d => d.id == Number(form.doctorId))! }]);
      setForm({ date: '', heure: '', statut: 'Confirmé', patientId: '', doctorId: '' });
    }
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm("Supprimer ce RDV ?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (res.ok) setAppointments(a => a.filter(ap => ap.id !== id));
  };

  // Pour modification inline, similaire à doctors (si besoin)

  return (
    <div className="p-8">
        <Link href="/admin">
  <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
    ← Retour au Dashboard
  </button>
</Link>

      <h2 className="text-2xl font-bold mb-4">Gestion des rendez-vous</h2>
      <form className="mb-6 flex gap-2 flex-wrap items-end" onSubmit={addAppointment}>
        <input type="date" name="date" value={form.date} onChange={e=>setForm(f=>({...f, date:e.target.value}))} required className="border p-2 rounded"/>
        <input type="time" name="heure" value={form.heure} onChange={e=>setForm(f=>({...f, heure:e.target.value}))} required className="border p-2 rounded"/>
        <select name="statut" value={form.statut} onChange={e=>setForm(f=>({...f, statut:e.target.value}))} className="border p-2 rounded">
          <option value="Confirmé">Confirmé</option>
          <option value="En attente">En attente</option>
          <option value="Annulé">Annulé</option>
        </select>
        <select name="patientId" value={form.patientId} onChange={e=>setForm(f=>({...f, patientId:e.target.value}))} required className="border p-2 rounded">
          <option value="">Patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>)}
        </select>
        <select name="doctorId" value={form.doctorId} onChange={e=>setForm(f=>({...f, doctorId:e.target.value}))} required className="border p-2 rounded">
          <option value="">Médecin</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.nom} {d.prenom}</option>)}
        </select>
        <button className="bg-blue-700 text-white px-4 py-2 rounded font-bold">Ajouter</button>
      </form>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Heure</th>
            <th className="p-2">Patient</th>
            <th className="p-2">Médecin</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(ap => (
            <tr key={ap.id}>
              <td className="p-2">{new Date(ap.date).toLocaleDateString()}</td>
              <td className="p-2">{ap.heure}</td>
              <td className="p-2">{ap.patient?.nom} {ap.patient?.prenom}</td>
              <td className="p-2">{ap.doctor?.nom} {ap.doctor?.prenom}</td>
              <td className="p-2">{ap.statut}</td>
              <td className="p-2">
                {/* Ajoute bouton Modifier si besoin */}
                <button onClick={() => deleteAppointment(ap.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
