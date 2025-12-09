/* import { useEffect, useState } from "react";
type Patient = { id: number; nom: string; prenom: string; email: string; dateNaissance: string; telephone?: string; adresse?: string; };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(d => setPatients(d.patients ?? []));
  }, []);
  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Patients</h1>
        <a href="/receptionist/patients/new" className="bg-blue-700 text-white px-4 py-2 font-bold rounded shadow hover:bg-blue-800">+ Nouveau patient</a>
      </div>
      <table className="w-full text-left text-sm shadow bg-white rounded">
        <thead><tr className="bg-blue-50"><th className="p-3">Nom</th><th className="p-3">Prénom</th><th className="p-3">Email</th><th className="p-3">Date naissance</th><th className="p-3">clinic</th><th className="p-3">Téléphone </th></tr> </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/receptionist/patients/${p.id}`}>
              <td className="p-3">{p.nom}</td>
              <td className="p-3">{p.prenom}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{new Date(p.dateNaissance).toLocaleDateString()}</td>
              <td className="p-3">{p.telephone ?? '-'}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 */import { useEffect, useState } from "react";
import Link from "next/link";

type Patient = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  telephone?: string;
  adresse?: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetch("/api/patients")
      .then((r) => r.json())
      .then((d) => setPatients(d.patients ?? []));
  }, []);

  const goToPatient = (id: number) => {
    window.location.href = `/receptionist/patients/${id}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mt-1 text-2xl font-bold text-blue-900">
              Patients
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consultez et gérez les informations des patients enregistrés.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/receptionist">
              <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <span className="mr-2 text-lg">←</span>
                Retour au Dashboard
              </button>
            </Link>

            <a
              href="/receptionist/patients/new"
              className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <span className="mr-2 text-lg">＋</span>
              Nouveau patient
            </a>
          </div>
        </div>

        {/* Carte table */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              {patients.length} patient{patients.length > 1 ? "s" : ""} trouvé
              {patients.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Nom
                    </th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Prénom
                    </th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date naissance
                    </th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Téléphone
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm text-slate-400"
                      >
                        Aucun patient pour le moment.
                        <br />
                        <span className="text-xs">
                          Utilisez le bouton “Nouveau patient” pour en ajouter un.
                        </span>
                      </td>
                    </tr>
                  )}

                  {patients.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => goToPatient(p.id)}
                      className="cursor-pointer bg-white transition hover:bg-blue-50/70"
                    >
                      <td className="px-3 py-2 align-middle text-slate-900">
                        {p.nom}
                      </td>
                      <td className="px-3 py-2 align-middle text-slate-900">
                        {p.prenom}
                      </td>
                      <td className="px-3 py-2 align-middle text-slate-700">
                        {p.email}
                      </td>
                      <td className="px-3 py-2 align-middle text-slate-700">
                        {new Date(p.dateNaissance).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 align-middle text-slate-700">
                        {p.telephone ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
