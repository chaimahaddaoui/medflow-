/* //page/admin/receptionists.tsx
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
 */
// pages/admin/receptionists.tsx
import Link from "next/dist/client/link";
import { useEffect, useState } from "react";

type Clinic = { id: number; nom: string };
type Receptionist = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  clinicId?: number | null;
  clinic?: { nom: string } | null;
};

export default function ReceptionistAdmin() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    clinicId: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    clinicId: ''
  });

  // Charge cliniques + réceptionnistes
  useEffect(() => {
    fetch('/api/clinics')
      .then(r => r.json())
      .then(d => setClinics(d.clinics ?? []));

    fetch('/api/receptionists')
      .then(r => r.json())
      .then(d => setReceptionists(d.receptionists ?? []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/receptionists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        clinicId: Number(form.clinicId)
      })
    });

    if (res.ok) {
      const data = await fetch('/api/receptionists').then(r => r.json());
      setReceptionists(data.receptionists ?? []);
      setForm({ nom: '', prenom: '', email: '', password: '', telephone: '', clinicId: '' });
    } else {
      console.error("Erreur création réceptionniste");
    }
  };

  // ----- ÉDITION -----
  const startEdit = (r: Receptionist) => {
    setEditingId(r.id);
    setEditForm({
      nom: r.nom,
      prenom: r.prenom,
      email: r.email,
      telephone: r.telephone || '',
      clinicId: r.clinicId ? String(r.clinicId) : ''
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveEdit = async () => {
    if (!editingId) return;
    const res = await fetch(`/api/receptionists/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        clinicId: editForm.clinicId ? Number(editForm.clinicId) : null
      })
    });
    if (res.ok) {
      const data = await fetch('/api/receptionists').then(r => r.json());
      setReceptionists(data.receptionists ?? []);
      setEditingId(null);
    }
  };

  // ----- SUPPRESSION -----
  const deleteReceptionist = async (id: number) => {
    if (!confirm('Supprimer ce réceptionniste ?')) return;
    const res = await fetch(`/api/receptionists/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
      setReceptionists(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour au Dashboard
        </button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulaire de création */}
        <div>
          <h1 className="text-xl mb-4 font-bold">Créer un réceptionniste</h1>
          <form onSubmit={handleSubmit} className="space-y-3 bg-white shadow rounded p-6">
            <input className="border rounded p-2 w-full" name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom" />
            <input className="border rounded p-2 w-full" name="prenom" value={form.prenom} onChange={handleChange} required placeholder="Prénom" />
            <input className="border rounded p-2 w-full" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" />
            <input className="border rounded p-2 w-full" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Mot de passe" />
            <input className="border rounded p-2 w-full" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
            <select className="border rounded p-2 w-full" name="clinicId" value={form.clinicId} onChange={handleChange} required>
              <option value="">Sélectionner une clinique</option>
              {clinics.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
            <button className="bg-green-700 text-white rounded px-4 py-2 font-bold">
              Ajouter réceptionniste
            </button>
          </form>
        </div>

        {/* Liste des réceptionnistes */}
        <div>
          <h2 className="text-xl mb-4 font-bold">Liste des réceptionnistes</h2>
          <div className="bg-white shadow rounded overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Nom</th>
                  <th className="p-2">Prénom</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Téléphone</th>
                  <th className="p-2">Clinique</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receptionists.map(r => {
                  const isEditing = editingId === r.id;
                  return (
                    <tr key={r.id} className="border-b">
                      <td className="p-2">
                        {isEditing
                          ? <input name="nom" className="border p-1 w-full" value={editForm.nom} onChange={handleEditChange} />
                          : r.nom}
                      </td>
                      <td className="p-2">
                        {isEditing
                          ? <input name="prenom" className="border p-1 w-full" value={editForm.prenom} onChange={handleEditChange} />
                          : r.prenom}
                      </td>
                      <td className="p-2">
                        {isEditing
                          ? <input name="email" className="border p-1 w-full" value={editForm.email} onChange={handleEditChange} />
                          : r.email}
                      </td>
                      <td className="p-2">
                        {isEditing
                          ? <input name="telephone" className="border p-1 w-full" value={editForm.telephone} onChange={handleEditChange} />
                          : (r.telephone || '-')}
                      </td>
                      <td className="p-2">
                        {isEditing
                          ? (
                            <select
                              name="clinicId"
                              className="border p-1 w-full"
                              value={editForm.clinicId}
                              onChange={handleEditChange}
                            >
                              <option value="">-</option>
                              {clinics.map(c => (
                                <option key={c.id} value={c.id}>{c.nom}</option>
                              ))}
                            </select>
                          )
                          : (r.clinic?.nom || '-')}
                      </td>
                      <td className="p-2 space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(r)}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteReceptionist(r.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {receptionists.length === 0 && (
                  <tr>
                    <td className="p-2 text-center text-gray-500" colSpan={6}>
                      Aucun réceptionniste pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
