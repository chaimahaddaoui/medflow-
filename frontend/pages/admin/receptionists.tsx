//page/admin/receptionists.tsx
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";

export default function ReceptionistAdmin() {
  const [clinics, setClinics] = useState<Array<{ id: number; nom: string }>>([]);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', telephone: '', clinicId: '' });

  useEffect(() => {
    fetch('/api/clinics').then(r => r.json()).then(d => setClinics(d.clinics ?? []));
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    await fetch('/api/receptionists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, clinicId: Number(form.clinicId) })
    });
    setForm({ nom: '', prenom: '', email: '', password: '', telephone: '', clinicId: '' });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour au Dashboard
        </button>
      </Link>
      <div className="p-8">
      <h1 className="text-xl mb-4 font-bold">Créer un réceptionniste</h1>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white shadow rounded p-6 max-w-md">
        <input className="border rounded p-2 w-full" name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom" />
        <input className="border rounded p-2 w-full" name="prenom" value={form.prenom} onChange={handleChange} required placeholder="Prénom" />
        <input className="border rounded p-2 w-full" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" />
        <input className="border rounded p-2 w-full" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Mot de passe" />
        <input className="border rounded p-2 w-full" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
        <select className="border rounded p-2 w-full" name="clinicId" value={form.clinicId} onChange={handleChange} required>
          <option value="">Sélectionner une clinique</option>
          {clinics.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        <button className="bg-green-700 text-white rounded px-4 py-2 font-bold">Ajouter réceptionniste</button>
      </form>
      </div>
    </div>
  );
}
