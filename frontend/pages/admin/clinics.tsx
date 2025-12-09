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
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    logo: "",
    horaires: "",
    specialiteIds: [] as number[],
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/clinics")
      .then((r) => r.json())
      .then((d) => setClinics(d.clinics ?? []));

    fetch("/api/specialitecentrales")
      .then((r) => r.json())
      .then((d) => setSpecialities(d.specialities ?? []));
  }, []);

  const handleChange = (e: any) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSpecialityChange = (e: any) => {
    const selectedId = Number(e.target.value);
    setForm((f) => ({
      ...f,
      specialiteIds: e.target.checked
        ? [...f.specialiteIds, selectedId]
        : f.specialiteIds.filter((id) => id !== selectedId),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/clinics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg("Clinique ajoutée avec succès !");
      const data = await res.json();
      setClinics((cs) => [...cs, data.clinic]);

      setForm({
        nom: "",
        adresse: "",
        telephone: "",
        email: "",
        logo: "",
        horaires: "",
        specialiteIds: [],
      });
    } else {
      setMsg("❌ Une erreur s'est produite.");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">

        {/* Retour */}
        <Link href="/admin">
          <button className="mb-6 bg-white shadow px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
            ← Retour au Dashboard
          </button>
        </Link>

        {/* Titre */}
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">
          Gestion des Cliniques
        </h1>

        {/* Message */}
        {msg && (
          <div className="mb-6 p-4 rounded bg-green-100 text-green-800 shadow">
            {msg}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-14">
          <h2 className="text-2xl font-semibold mb-5 text-blue-700">
            Ajouter une nouvelle clinique
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5">
              <input
                name="nom"
                required
                placeholder="Nom de la clinique"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.nom}
                onChange={handleChange}
              />

              <input
                name="telephone"
                required
                placeholder="Téléphone"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.telephone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <input
                name="adresse"
                required
                placeholder="Adresse"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.adresse}
                onChange={handleChange}
              />

              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <input
                name="logo"
                placeholder="URL du logo (optionnel)"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.logo}
                onChange={handleChange}
              />

              <input
                name="horaires"
                placeholder="Horaires (optionnel)"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.horaires}
                onChange={handleChange}
              />
            </div>

            {/* Spécialités */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <label className="font-semibold text-blue-800 mb-3 block">
                Spécialités disponibles :
              </label>

              <div className="grid grid-cols-2 gap-3">
                {specialities.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 bg-white border p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      value={s.id}
                      checked={form.specialiteIds.includes(s.id)}
                      onChange={handleSpecialityChange}
                      className="w-4 h-4"
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <button className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition shadow">
              ➕ Ajouter la clinique
            </button>
          </form>
        </div>

        {/* Liste des cliniques */}
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Cliniques enregistrées</h2>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Adresse</th>
                <th className="p-3">Téléphone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Horaires</th>
              </tr>
            </thead>

            <tbody>
              {clinics.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-3 font-medium">{c.nom}</td>
                  <td className="p-3">{c.adresse}</td>
                  <td className="p-3">{c.telephone}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.horaires || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
