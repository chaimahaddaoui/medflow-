
 
import { useEffect, useState } from "react";
import Link from "next/link";

type Speciality = {
  id: number;
  label: string;
  description?: string;
};

export default function SpecialitiesPage() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [form, setForm] = useState({ label: "", description: "" });
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadSpecialities();
  }, []);

  const loadSpecialities = async () => {
    const res = await fetch("/api/specialitecentrales");
    const data = await res.json();
    setSpecialities(data.specialities ?? []);
  };

  const handleChange = (e: any) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingId) {
      const res = await fetch(`/api/specialitecentrales/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg("Spécialité mise à jour !");
        setEditingId(null);
        setForm({ label: "", description: "" });
        loadSpecialities();
      }
    } else {
      const res = await fetch("/api/specialitecentrales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg("Spécialité ajoutée !");
        setForm({ label: "", description: "" });
        loadSpecialities();
      }
    }
  };

  const handleEdit = (spec: Speciality) => {
    setForm({ label: spec.label, description: spec.description || "" });
    setEditingId(spec.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette spécialité ?")) return;

    const res = await fetch(`/api/specialitecentrales/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMsg("Spécialité supprimée !");
      loadSpecialities();
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/admin">
          <button className="mb-6 flex items-center gap-2 bg-white shadow hover:shadow-md transition px-4 py-2 rounded-lg">
            ← Retour
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Gestion des spécialités centrales
        </h1>

        {msg && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded shadow">
            {msg}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Modifier la spécialité" : "Ajouter une spécialité"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                name="label"
                required
                placeholder="Ex : Cardiologie"
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                value={form.label}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Description générale..."
                className="border p-3 rounded-lg w-full focus:ring-2 ring-blue-400"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button className="bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow hover:bg-green-800 transition">
                {editingId ? "Mettre à jour" : "Ajouter"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ label: "", description: "" });
                    setEditingId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-4 text-left font-semibold">Spécialité</th>
                <th className="p-4 text-left font-semibold">Description</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {specialities.map((s, index) => (
                <tr
                  key={s.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-4">{s.label}</td>
                  <td className="p-4">{s.description || "-"}</td>

                  <td className="p-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
