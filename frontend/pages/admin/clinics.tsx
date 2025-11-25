import { useEffect, useState } from "react";
import Link from "next/link";

type Clinic = {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  logo?: string;
  horaires?: string;
  createdAt?: string;
};

type SpecialityCentral = {
  id: number;
  label: string;
};

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialities, setSpecialities] = useState<SpecialityCentral[]>([]);
  const [form, setForm] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    logo: '',
    horaires: '',
    specialiteIds: [] as number[]
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/clinics').then(r => r.json()).then(d => setClinics(d.clinics ?? []));
    fetch('/api/specialitecentrales').then(r => r.json()).then(d => setSpecialities(d.specialities ?? []));
  }, []);

  const handleChange = (e: any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSpecialityChange = (e: any) => {
    const selectedId = Number(e.target.value);
    setForm(f => ({
      ...f,
      specialiteIds: e.target.checked
        ? [...f.specialiteIds, selectedId]
        : f.specialiteIds.filter(id => id !== selectedId)
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/clinics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMsg("Clinique ajoutée !");
      setForm({ nom: '', adresse: '', telephone: '', email: '', logo: '', horaires: '', specialiteIds: [] });
      const r = await res.json();
      setClinics(cs => [...cs, r.clinic]);
    } else {
      setMsg("Erreur lors de l'ajout.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour au Dashboard
        </button>
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Gestion des cliniques</h1>
      {msg && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{msg}</div>}
      <form className="mb-8 space-y-3 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input name="nom" required placeholder="Nom clinique" className="border p-2 rounded w-full" value={form.nom} onChange={handleChange} />
          <input name="telephone" required placeholder="Téléphone" className="border p-2 rounded w-full" value={form.telephone} onChange={handleChange} />
        </div>
        <div className="flex gap-4">
          <input name="adresse" required placeholder="Adresse" className="border p-2 rounded w-full" value={form.adresse} onChange={handleChange} />
          <input name="email" required type="email" placeholder="Email" className="border p-2 rounded w-full" value={form.email} onChange={handleChange} />
        </div>
        <div className="flex gap-4">
          <input name="logo" placeholder="URL Logo (option)" className="border p-2 rounded w-full" value={form.logo} onChange={handleChange} />
          <input name="horaires" placeholder="Horaires (option)" className="border p-2 rounded w-full" value={form.horaires} onChange={handleChange} />
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <label className="block font-semibold mb-3">Sélectionner les spécialités :</label>
          <div className="grid grid-cols-2 gap-3">
            {specialities.map(s => (
              <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={s.id}
                  checked={form.specialiteIds.includes(s.id)}
                  onChange={handleSpecialityChange}
                  className="w-4 h-4"
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="bg-green-700 text-white px-4 py-2 rounded font-bold mt-3">Ajouter clinique</button>
      </form>
      <h2 className="text-lg font-bold mb-2 text-blue-800">Liste des cliniques</h2>
      <table className="w-full shadow rounded bg-white text-sm">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-2">Nom</th>
            <th className="p-2">Adresse</th>
            <th className="p-2">Téléphone</th>
            <th className="p-2">Email</th>
            <th className="p-2">Horaires</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map(c =>
            <tr key={c.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{c.nom}</td>
              <td className="p-2">{c.adresse}</td>
              <td className="p-2">{c.telephone}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2">{c.horaires ?? '-'}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
