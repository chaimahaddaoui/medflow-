import { useEffect, useState } from "react";
import Link from "next/link";

/* ============================
   TYPES
============================= */
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
  clinicId?: number; // Optionnel => spécialité générale
};

type Clinic = {
  id: number;
  nom: string;
};

type FormState = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  clinicId: string;
  specialiteId: string;
};

/* ============================
   COMPOSANT PRINCIPAL
============================= */
export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialities, setSpecialities] = useState<SpecialityCentral[]>([]);
  const [filteredSpecialities, setFilteredSpecialities] = useState<SpecialityCentral[]>([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormState>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    clinicId: "",
    specialiteId: "",
  });

  /* ============================
     FETCH DATA
  ============================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dRes, cRes, sRes] = await Promise.all([
          fetch("/api/doctors"),
          fetch("/api/clinics"),
          fetch("/api/specialitecentrales"),
        ]);

        const doctorsData = await dRes.json();
        const clinicsData = await cRes.json();
        const specData = await sRes.json();

        setDoctors(doctorsData.doctors ?? []);
        setClinics(clinicsData.clinics ?? []);
        setSpecialities(specData.specialities ?? []);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ============================
     FILTRAGE SPECIALITÉS
  ============================= */
  useEffect(() => {
    if (!form.clinicId) {
      setFilteredSpecialities([]);
      return;
    }

    const clinicIdNumber = Number(form.clinicId);

    const filtered = specialities.filter((s) => {
      // 1) Si la spécialité a une clinique, elle doit correspondre
      if (s.clinicId) return s.clinicId === clinicIdNumber;

      // 2) Sinon, c’est une spécialité générale => on l'affiche aussi
      return true;
    });

    setFilteredSpecialities(filtered);
  }, [form.clinicId, specialities]);

  /* ============================
     HANDLERS
  ============================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      clinicId: Number(form.clinicId),
      specialiteId: Number(form.specialiteId),
    };

    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout");

      const data = await res.json();
      setDoctors((prev) => [...prev, data.doctor]);

      // reset
      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        clinicId: "",
        specialiteId: "",
      });
      setFilteredSpecialities([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce médecin ?")) return;

    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");

      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  /* ============================
     UI
  ============================= */
  if (loading) {
    return <p className="text-center py-10 text-gray-500">Chargement...</p>;
  }

  return (
    <div className="p-8">
      <Link href="/admin">
        <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          ← Retour au Dashboard
        </button>
      </Link>

      <h2 className="text-3xl font-semibold mb-6">Gestion des médecins</h2>

      {/* FORMULAIRE */}
      <form
        className="mb-8 flex flex-wrap gap-4 bg-white p-4 rounded shadow"
        onSubmit={addDoctor}
      >
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
          placeholder="Nom"
          className="border p-2 rounded w-48"
        />

        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          required
          placeholder="Prénom"
          className="border p-2 rounded w-48"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-60"
        />

        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="border p-2 rounded w-40"
        />

        {/* CLINIQUE */}
        <select
          name="clinicId"
          value={form.clinicId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-52"
        >
          <option value="">Choisir une clinique</option>
          {clinics.map((cl) => (
            <option key={cl.id} value={cl.id}>
              {cl.nom}
            </option>
          ))}
        </select>

        {/* SPECIALITES */}
        <select
          name="specialiteId"
          value={form.specialiteId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-60"
          disabled={!form.clinicId}
        >
          <option value="">
            {!form.clinicId ? "Choisir une clinique d'abord" : "Choisir une spécialité"}
          </option>

          {filteredSpecialities.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded font-semibold">
          Ajouter
        </button>
      </form>

      {/* TABLEAU */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Prénom</th>
            <th className="p-3 text-left">Clinique</th>
            <th className="p-3 text-left">Spécialité</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Téléphone</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.length === 0 && (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-400">
                Aucun médecin disponible.
              </td>
            </tr>
          )}

          {doctors.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="p-3">{doc.nom}</td>
              <td className="p-3">{doc.prenom}</td>
              <td className="p-3">{doc.clinic?.nom ?? "-"}</td>
              <td className="p-3">{doc.specialite?.label ?? "-"}</td>
              <td className="p-3">{doc.email}</td>
              <td className="p-3">{doc.telephone ?? "-"}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1"
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
