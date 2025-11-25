/* import { useEffect, useState } from "react";
import Link from "next/link";

type Doctor = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  clinicId: number;
  specialiteId: number;
  clinic?: { nom: string };
  specialite?: { label: string };
};

type SpecialityCentral = { id: number; label: string; description?: string; };
type Clinic = { id: number; nom: string };

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialities, setSpecialities] = useState<SpecialityCentral[]>([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', clinicId: '', specialiteId: '',
  });

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data.doctors ?? []));
    fetch('/api/clinics')
      .then(res => res.json())
      .then(data => setClinics(data.clinics ?? []));
    // FETCH CENTRAL SPECIALITIES ONLY ONCE
    fetch('/api/specialitecentrales')
      .then(res => res.json())
      .then(data => setSpecialities(data.specialities ?? []));
  }, []);

  // Ajout de médecin
  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        clinicId: Number(form.clinicId),
        specialiteId: Number(form.specialiteId),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setDoctors(d => [...d, data.doctor]);
      setForm({ nom: '', prenom: '', email: '', telephone: '', clinicId: '', specialiteId: '' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce médecin ?')) return;
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    if (res.ok) setDoctors(ds => ds.filter(d => d.id !== id));
  };

  const handleChange = (e: any) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="p-8">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour au Dashboard
        </button>
      </Link>
      <h2 className="text-2xl font-bold mb-4">Gestion des médecins</h2>
      <form className="mb-6 flex gap-2 flex-wrap items-end" onSubmit={addDoctor}>
        <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom" className="border p-2 rounded" />
        <input name="prenom" value={form.prenom} onChange={handleChange} required placeholder="Prénom" className="border p-2 rounded" />
        <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="border p-2 rounded" type="email" />
        <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" className="border p-2 rounded" />
        <select
          name="clinicId"
          value={form.clinicId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Choisir une clinique</option>
          {clinics.map(cl => <option key={cl.id} value={cl.id}>{cl.nom}</option>)}
        </select>
        <select
          name="specialiteId"
          value={form.specialiteId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Choisir la spécialité</option>
          {specialities.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <button className="bg-blue-700 text-white px-4 py-2 rounded font-bold">Ajouter</button>
      </form>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Prénom</th>
            <th className="p-2 text-left">Clinique</th>
            <th className="p-2 text-left">Spécialité</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Téléphone</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-400">Aucun médecin.</td>
            </tr>
          )}
          {doctors.map(doc => (
            <tr key={doc.id}>
              <td>{doc.nom}</td>
              <td>{doc.prenom}</td>
              <td>{doc.clinic?.nom ?? '-'}</td>
              <td>{doc.specialite?.label ?? '-'}</td>
              <td>{doc.email}</td>
              <td>{doc.telephone ?? '-'}</td>
              <td>
                <button onClick={() => handleDelete(doc.id)} className="bg-red-600 text-white rounded px-2 py-1">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 */
import { useEffect, useState } from "react";
import Link from "next/link";

type Doctor = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  clinicId: number;
  specialiteId: number;
  clinic?: { nom: string };
  specialite?: { label: string };
};

type SpecialityCentral = {
  id: number;
  label: string;
  description?: string;
  clinicId?: number; // pour filtrer par clinique si besoin
};

type Clinic = { id: number; nom: string };

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialities, setSpecialities] = useState<SpecialityCentral[]>([]);
  const [filteredSpecialities, setFilteredSpecialities] = useState<SpecialityCentral[]>([]);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    clinicId: "",
    specialiteId: "",
  });

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data.doctors ?? []));

    fetch("/api/clinics")
      .then((res) => res.json())
      .then((data) => setClinics(data.clinics ?? []));

    fetch("/api/specialitecentrales")
      .then((res) => res.json())
      .then((data) => setSpecialities(data.specialities ?? []));
  }, []);

  //  Filtrer les spécialités selon la clinique choisie
  useEffect(() => {
    if (form.clinicId === "") {
      setFilteredSpecialities([]);
      return;
    }

    const clinicIdNumber = Number(form.clinicId);

    // Si chaque specialité possède un clinicId → filtrage intelligent
    const filtered = specialities.filter((s) =>
      s.clinicId ? s.clinicId === clinicIdNumber : true
    );

    setFilteredSpecialities(filtered);
  }, [form.clinicId, specialities]);

  const handleChange = (e: any) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        clinicId: Number(form.clinicId),
        specialiteId: Number(form.specialiteId),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setDoctors((d) => [...d, data.doctor]);
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        clinicId: "",
        specialiteId: "",
      });
      setFilteredSpecialities([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce médecin ?")) return;

    const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
    if (res.ok) setDoctors((ds) => ds.filter((d) => d.id !== id));
  };

  return (
    <div className="p-8">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour au Dashboard
        </button>
      </Link>

      <h2 className="text-2xl font-bold mb-4">Gestion des médecins</h2>

      {/* FORMULAIRE */}
      <form className="mb-6 flex gap-2 flex-wrap items-end" onSubmit={addDoctor}>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
          placeholder="Nom"
          className="border p-2 rounded"
        />
        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          required
          placeholder="Prénom"
          className="border p-2 rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="border p-2 rounded"
        />

        {/* CLINIQUE */}
        <select
          name="clinicId"
          value={form.clinicId}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Choisir une clinique</option>
          {clinics.map((cl) => (
            <option key={cl.id} value={cl.id}>
              {cl.nom}
            </option>
          ))}
        </select>

        {/* SPECIALITE — Activée uniquement si une clinique est choisie */}
        <select
          name="specialiteId"
          value={form.specialiteId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
          disabled={form.clinicId === ""}
        >
          <option value="">
            {form.clinicId === ""
              ? "Choisir une clinique d'abord"
              : "Choisir la spécialité"}
          </option>

          {filteredSpecialities.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <button className="bg-blue-700 text-white px-4 py-2 rounded font-bold">
          Ajouter
        </button>
      </form>

      {/* TABLEAU */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Prénom</th>
            <th className="p-2 text-left">Clinique</th>
            <th className="p-2 text-left">Spécialité</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Téléphone</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-400">
                Aucun médecin.
              </td>
            </tr>
          )}

          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.nom}</td>
              <td>{doc.prenom}</td>
              <td>{doc.clinic?.nom ?? "-"}</td>
              <td>{doc.specialite?.label ?? "-"}</td>
              <td>{doc.email}</td>
              <td>{doc.telephone ?? "-"}</td>
              <td>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-600 text-white rounded px-2 py-1"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
