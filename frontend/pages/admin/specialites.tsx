import { useEffect, useState } from "react";
import Link from "next/link";

type Speciality = {
  id: number;
  label: string;
  description?: string;
};

export default function SpecialitiesPage() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [form, setForm] = useState({ label: '', description: '' });
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { loadSpecialities(); }, []);
  const loadSpecialities = async () => {
    const res = await fetch('/api/specialitecentrales');
    const data = await res.json();
    setSpecialities(data.specialities ?? []);
  };

  const handleChange = (e: any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editingId) {
      const res = await fetch(`/api/specialitecentrales/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMsg("Spécialité mise à jour !");
        setEditingId(null);
        setForm({ label: '', description: '' });
        loadSpecialities();
      }
    } else {
      const res = await fetch('/api/specialitecentrales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMsg("Spécialité ajoutée !");
        setForm({ label: '', description: '' });
        loadSpecialities();
      }
    }
  };

  const handleEdit = (spec: Speciality) => {
    setForm({ label: spec.label, description: spec.description || '' });
    setEditingId(spec.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette spécialité ?')) return;
    const res = await fetch(`/api/specialitecentrales/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMsg("Spécialité supprimée !");
      loadSpecialities();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour
        </button>
      </Link>
      <h1 className="text-2xl font-bold mb-6">Gestion des spécialités centrales</h1>
      {msg && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{msg}</div>}
      <form className="mb-8 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <input name="label" required placeholder="Nom de la spécialité" className="border p-2 rounded w-full mb-3" value={form.label} onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="border p-2 rounded w-full mb-3" rows={3} value={form.description} onChange={handleChange} />
        <button className="bg-green-700 text-white px-4 py-2 rounded font-bold">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
        {editingId && <button type="button" onClick={() => { setForm({ label: '', description: '' }); setEditingId(null); }} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Annuler</button>}
      </form>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-blue-50">
          <tr><th className="p-3 text-left">Spécialité</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {specialities.map(s => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{s.label}</td>
              <td className="p-3">{s.description || '-'}</td>
              <td className="p-3 text-center">
                <button onClick={() => handleEdit(s)} className="bg-blue-600 text-white px-2 py-1 rounded mr-2">Modifier</button>
                <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-2 py-1 rounded">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
