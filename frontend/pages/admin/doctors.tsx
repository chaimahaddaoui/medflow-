import { useEffect, useState } from "react";
import Link from "next/link";


type Doctor = {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  telephone?: string;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState<Omit<Doctor, "id">>({
    nom: '',
    prenom: '',
    specialite: '',
    email: '',
    telephone: '',
  });
  const [editingId, setEditingId] = useState<number|null>(null);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data.doctors ?? []));
  }, []);

  // Ajout
  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setDoctors(d => [...d, data.doctor]);
      setForm({ nom: '', prenom: '', specialite: '', email: '', telephone: '' });
    }
  };

  // Modif (inline)
  const saveEdit = async (doctor: Doctor) => {
    const res = await fetch(`/api/doctors/${doctor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    });
    if (res.ok) {
      setDoctors(ds => ds.map(d => d.id === doctor.id ? doctor : d));
      setEditingId(null);
    }
  };

  // Suppression
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce médecin ?')) return;
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    if (res.ok) setDoctors(ds => ds.filter(d => d.id !== id));
  };

  return (

    
    <div className="p-8">
        <Link href="/admin">
  <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
    ← Retour au Dashboard
  </button>
</Link>

      <h2 className="text-2xl font-bold mb-4">Gestion des médecins</h2>
      <form className="mb-6 flex gap-2 flex-wrap items-end" onSubmit={addDoctor}>
        <input name="nom" value={form.nom} onChange={e=>setForm(f=>({...f, nom:e.target.value}))} required placeholder="Nom" className="border p-2 rounded"/>
        <input name="prenom" value={form.prenom} onChange={e=>setForm(f=>({...f, prenom:e.target.value}))} required placeholder="Prénom" className="border p-2 rounded"/>
        <input name="specialite" value={form.specialite} onChange={e=>setForm(f=>({...f, specialite:e.target.value}))} required placeholder="Spécialité" className="border p-2 rounded"/>
        <input name="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} required placeholder="Email" className="border p-2 rounded" type="email"/>
        <input name="telephone" value={form.telephone} onChange={e=>setForm(f=>({...f, telephone:e.target.value}))} placeholder="Téléphone" className="border p-2 rounded"/>
        <button className="bg-blue-700 text-white px-4 py-2 rounded font-bold">Ajouter</button>
      </form>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Prénom</th>
            <th className="p-2 text-left">Spécialité</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Téléphone</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 && (<tr><td colSpan={6} className="p-4 text-center text-gray-400">Aucun médecin.</td></tr>)}
          {doctors.map(doc => (
            <tr key={doc.id}>
              {editingId === doc.id ? (
                <>
                  <td><input value={doc.nom} onChange={e=>setDoctors(ds=>ds.map(d=>d.id===doc.id?{...d, nom:e.target.value}:d))} className="border rounded p-1"/></td>
                  <td><input value={doc.prenom} onChange={e=>setDoctors(ds=>ds.map(d=>d.id===doc.id?{...d, prenom:e.target.value}:d))} className="border rounded p-1"/></td>
                  <td><input value={doc.specialite} onChange={e=>setDoctors(ds=>ds.map(d=>d.id===doc.id?{...d, specialite:e.target.value}:d))} className="border rounded p-1"/></td>
                  <td><input value={doc.email} onChange={e=>setDoctors(ds=>ds.map(d=>d.id===doc.id?{...d, email:e.target.value}:d))} className="border rounded p-1"/></td>
                  <td><input value={doc.telephone??""} onChange={e=>setDoctors(ds=>ds.map(d=>d.id===doc.id?{...d, telephone:e.target.value}:d))} className="border rounded p-1"/></td>
                  <td>
                    <button onClick={()=>saveEdit(doc)} className="bg-green-600 text-white rounded px-2 py-1 mr-2">Valider</button>
                    <button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white rounded px-2 py-1">Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{doc.nom}</td>
                  <td>{doc.prenom}</td>
                  <td>{doc.specialite}</td>
                  <td>{doc.email}</td>
                  <td>{doc.telephone ?? '-'}</td>
                  <td>
                    <button onClick={()=>setEditingId(doc.id)} className="bg-yellow-600 text-white rounded px-2 py-1 mr-2">Modifier</button>
                    <button onClick={()=>handleDelete(doc.id)} className="bg-red-600 text-white rounded px-2 py-1">Supprimer</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
