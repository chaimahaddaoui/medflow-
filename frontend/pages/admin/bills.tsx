import { useEffect, useState } from "react";

type Bill = {
  id: number;
  montant: number;
  statut: string;
  dateCreation: string;
  patient: { id: number; nom: string; prenom: string };
  appointment?: { id: number; date: string };
  patientId: number;
  appointmentId?: number;
};

type Patient = { id: number; nom: string; prenom: string }
type Appointment = { id: number; date: string }

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({ montant: '', statut: 'En attente', patientId: '', appointmentId: '' });

  useEffect(() => {
    fetch('/api/bills').then(r => r.json()).then(d => setBills(d.bills ?? []));
    fetch('/api/patients').then(r => r.json()).then(d => setPatients(d.patients ?? []));
    fetch('/api/appointments').then(r => r.json()).then(d => setAppointments(d.appointments ?? []));
  }, []);

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setBills(b => [...b, { ...data.bill, patient: patients.find(p => p.id == Number(form.patientId))! }]);
      setForm({ montant: '', statut: 'En attente', patientId: '', appointmentId: '' });
    }
  };

  const deleteBill = async (id: number) => {
    if (!confirm('Supprimer cette facture ?')) return;
    const res = await fetch(`/api/bills/${id}`, { method: 'DELETE' });
    if (res.ok) setBills(bills => bills.filter(b => b.id !== id));
  };

  

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Gestion des factures</h2>
      <form className="mb-6 flex gap-2 flex-wrap items-end" onSubmit={addBill}>
        <input type="number" name="montant" step="0.01" min="0" required placeholder="Montant"
          className="border p-2 rounded" value={form.montant}
          onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} />
        <select name="statut" className="border p-2 rounded" value={form.statut}
          onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
          <option value="En attente">En attente</option>
          <option value="Payée">Payée</option>
          <option value="Annulée">Annulée</option>
        </select>
        <select name="patientId" required className="border p-2 rounded" value={form.patientId}
          onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}>
          <option value="">Patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>)}
        </select>
        <select name="appointmentId" className="border p-2 rounded" value={form.appointmentId}
          onChange={e => setForm(f => ({ ...f, appointmentId: e.target.value }))}>
          <option value="">Aucun rendez-vous</option>
          {appointments.map(a => <option key={a.id} value={a.id}>{new Date(a.date).toLocaleDateString()} (id {a.id})</option>)}
        </select>
        <button className="bg-green-700 text-white px-4 py-2 rounded font-bold">Ajouter</button>
      </form>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Patient</th>
            <th className="p-2">Montant (€)</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Rendez-vous</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td className="p-2">{new Date(bill.dateCreation).toLocaleDateString()}</td>
              <td className="p-2">{bill.patient?.nom} {bill.patient?.prenom}</td>
              <td className="p-2">{bill.montant}</td>
              <td className="p-2">{bill.statut}</td>
              <td className="p-2">{bill.appointment?.id ? new Date(bill.appointment.date).toLocaleDateString() : '-'}</td>
              <td className="p-2">
                {/* Ici ajoute boutons Modifier/Supprimer si besoin */}
                <button onClick={() => deleteBill(bill.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
