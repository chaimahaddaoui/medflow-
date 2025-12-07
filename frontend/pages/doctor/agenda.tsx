// pages/doctor/agenda.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Slot = {
  id: number;
  start: string;
  end: string;
  type?: string | null;
  note?: string | null;
};

export default function DoctorAgendaPage() {
  const router = useRouter();
  // TODO : doctorId depuis l'auth; ici 1 en dur
  const doctorId = 1;

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    note: "",
  });
  const [msg, setMsg] = useState("");

  const loadSlots = () => {
    setLoading(true);
    fetch(`/api/doctor-availability?doctorId=${doctorId}`)
      .then((res) => res.json())
      .then((d) => {
        setSlots(d.slots ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement disponibilités:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!form.date || !form.startTime || !form.endTime) {
      setMsg("Date, heure début et heure fin sont obligatoires.");
      return;
    }

    const start = new Date(`${form.date}T${form.startTime}:00`);
    const end = new Date(`${form.date}T${form.endTime}:00`);

    const res = await fetch("/api/doctor-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start,
        end,
        type: form.type || null,
        note: form.note || null,
      }),
    });

    if (res.ok) {
      setForm({ date: "", startTime: "", endTime: "", type: "", note: "" });
      loadSlots();
    } else {
      const err = await res.json().catch(() => ({}));
      setMsg(err.error || "Erreur création créneau");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce créneau de disponibilité ?")) return;
    const res = await fetch(`/api/doctor-availability/${id}`, {
      method: "DELETE",
    });
    if (res.ok || res.status === 204) {
      setSlots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // groupement par jour pour affichage type "calendrier liste"
  const grouped = (() => {
    const map = new Map<string, Slot[]>();
    slots.forEach((s) => {
      const key = new Date(s.start).toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([day, items]) => ({
        day,
        items: items.sort(
          (a, b) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        ),
      }));
  })();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-800">
          MedFlow
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/doctor" className="block px-3 py-2 rounded hover:bg-blue-800">
            Dashboard
          </a>
          <a href="/doctor/patients" className="block px-3 py-2 rounded hover:bg-blue-800">
            Dossiers patients
          </a>
          <a href="/doctor/agenda" className="block px-3 py-2 rounded bg-blue-800">
            Agenda (disponibilités)
          </a>
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-blue-900">Agenda du médecin</h1>

        {/* Formulaire création de créneau */}
        <section className="bg-white shadow rounded p-6 max-w-xl">
          <h2 className="text-lg font-bold mb-4 text-blue-900">
            Ajouter un créneau de disponibilité
          </h2>

          {msg && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {msg}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleCreate}>
            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                className="border rounded w-full p-2"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Heure début
                </label>
                <input
                  type="time"
                  name="startTime"
                  className="border rounded w-full p-2"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Heure fin
                </label>
                <input
                  type="time"
                  name="endTime"
                  className="border rounded w-full p-2"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Type</label>
              <input
                type="text"
                name="type"
                className="border rounded w-full p-2"
                value={form.type}
                onChange={handleChange}
                placeholder="Consultation, Contrôle, ... (optionnel)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Note</label>
              <textarea
                name="note"
                className="border rounded w-full p-2"
                value={form.note}
                onChange={handleChange}
                placeholder="Infos supplémentaires (optionnel)"
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white font-bold px-4 py-2 rounded hover:bg-green-800"
            >
              Ajouter le créneau
            </button>
          </form>
        </section>

        {/* Liste des créneaux (vue calendrier par jour) */}
        <section className="space-y-4">
          {loading ? (
            <div>Chargement des disponibilités...</div>
          ) : grouped.length === 0 ? (
            <div className="bg-white shadow rounded p-6 text-sm text-gray-500">
              Aucun créneau défini pour l’instant.
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.day} className="bg-white shadow rounded p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {new Date(g.day).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-2 text-left">Heure</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Note</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((s) => (
                      <tr key={s.id} className="border-b">
                        <td className="p-2">
                          {new Date(s.start).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(s.end).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-2">{s.type || "-"}</td>
                        <td className="p-2 whitespace-pre-line">{s.note || "-"}</td>
                        <td className="p-2">
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                            onClick={() => handleDelete(s.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
