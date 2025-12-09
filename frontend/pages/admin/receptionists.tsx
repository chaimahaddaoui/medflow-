// pages/admin/receptionists.tsx
import Link from "next/link";
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
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    clinicId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    clinicId: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/clinics")
      .then((r) => r.json())
      .then((d) => setClinics(d.clinics ?? []));
    fetch("/api/receptionists")
      .then((r) => r.json())
      .then((d) => setReceptionists(d.receptionists ?? []));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/receptionists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, clinicId: Number(form.clinicId) }),
    });
    if (res.ok) {
      const data = await fetch("/api/receptionists").then((r) => r.json());
      setReceptionists(data.receptionists ?? []);
      setForm({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        telephone: "",
        clinicId: "",
      });
    }
    setSaving(false);
  };

  const startEdit = (r: Receptionist) => {
    setEditingId(r.id);
    setEditForm({
      nom: r.nom,
      prenom: r.prenom,
      email: r.email,
      telephone: r.telephone || "",
      clinicId: r.clinicId ? String(r.clinicId) : "",
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const res = await fetch(`/api/receptionists/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        clinicId: editForm.clinicId ? Number(editForm.clinicId) : null,
      }),
    });
    if (res.ok) {
      const data = await fetch("/api/receptionists").then((r) => r.json());
      setReceptionists(data.receptionists ?? []);
      setEditingId(null);
    }
    setSaving(false);
  };

  const deleteReceptionist = async (id: number) => {
    if (!confirm("Supprimer ce réceptionniste ?")) return;
    const res = await fetch(`/api/receptionists/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setReceptionists((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const isEditing = (id: number) => editingId === id;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Gestion des réceptionnistes
            </h1>
           
          </div>
          <Link href="/admin">
            <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              <span className="mr-2 text-lg">←</span>
              Retour au Dashboard
            </button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {/* Formulaire */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Créer un réceptionniste
              </h2>
              {saving && (
                <span className="text-xs font-medium text-amber-600">
                  Sauvegarde en cours...
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Nom
                  </label>
                  <input
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Prénom
                  </label>
                  <input
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Mot de passe
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Téléphone
                  </label>
                  <input
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Clinique
                  </label>
                  <select
                    name="clinicId"
                    value={form.clinicId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionner une clinique</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="reset"
                  onClick={() =>
                    setForm({
                      nom: "",
                      prenom: "",
                      email: "",
                      password: "",
                      telephone: "",
                      clinicId: "",
                    })
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Réinitialiser
                </button>
                <button
                  disabled={saving}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Ajout en cours..." : "Ajouter le réceptionniste"}
                </button>
              </div>
            </form>
          </div>

          {/* Liste */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Liste des réceptionnistes
              </h2>
              <span className="text-xs text-slate-500">
                {receptionists.length} enregistrement
                {receptionists.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <input
                placeholder="Rechercher par nom, prénom ou email (à implémenter)…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 shadow-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500 sm:w-72"
                disabled
              />
              {/* Slot pour filtres ultérieurs */}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="max-h-[480px] overflow-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Nom
                      </th>
                      <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Prénom
                      </th>
                      <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>
                      <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Téléphone
                      </th>
                      <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Clinique
                      </th>
                      <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receptionists.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-sm text-slate-400"
                        >
                          Aucun réceptionniste pour le moment.
                          <br />
                          <span className="text-xs">
                            Utilisez le formulaire à gauche pour en créer un.
                          </span>
                        </td>
                      </tr>
                    )}

                    {receptionists.map((r) => (
                      <tr
                        key={r.id}
                        className="odd:bg-white even:bg-slate-50/60 hover:bg-emerald-50/40"
                      >
                        <td className="px-3 py-2 align-middle">
                          {isEditing(r.id) ? (
                            <input
                              name="nom"
                              value={editForm.nom}
                              onChange={handleEditChange}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <span className="font-medium text-slate-900">
                              {r.nom}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {isEditing(r.id) ? (
                            <input
                              name="prenom"
                              value={editForm.prenom}
                              onChange={handleEditChange}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <span className="text-slate-800">{r.prenom}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {isEditing(r.id) ? (
                            <input
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <span className="text-slate-700">{r.email}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {isEditing(r.id) ? (
                            <input
                              name="telephone"
                              value={editForm.telephone}
                              onChange={handleEditChange}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          ) : (
                            <span className="text-slate-700">
                              {r.telephone || "—"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          {isEditing(r.id) ? (
                            <select
                              name="clinicId"
                              value={editForm.clinicId}
                              onChange={handleEditChange}
                              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">—</option>
                              {clinics.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nom}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-700">
                              {r.clinic?.nom || "—"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing(r.id) ? (
                              <>
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={saveEdit}
                                  className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  Enregistrer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(r)}
                                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                                >
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteReceptionist(r.id)}
                                  className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Astuce : prévoyez plus tard un tri et une recherche côté serveur
              pour les grandes listes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
