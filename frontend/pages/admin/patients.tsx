import { useEffect, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data.patients ?? []));
  }, []);

  const filteredPatients = patients.filter((p) =>
    `${p.nom} ${p.prenom} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Retour */}
      <Link href="/admin">
        <button className="mb-6 bg-white shadow px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
          ← Retour au Dashboard
        </button>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Patients</h1>

        
        
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6 w-full md:w-1/3">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded pl-10 pr-3 py-2 shadow-sm bg-white"
        />
      </div>

      {/* Carte contenant le tableau */}
      <div className="bg-white rounded-lg shadow p-4 overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left font-semibold">Nom</th>
              <th className="p-3 text-left font-semibold">Prénom</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Date de naissance</th>
              <th className="p-3 text-left font-semibold">Téléphone</th>
              <th className="p-3 text-left font-semibold">Adresse</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 text-gray-500"
                >
                  Aucun patient trouvé
                </td>
              </tr>
            )}

            {filteredPatients.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{p.nom}</td>
                <td className="p-3">{p.prenom}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">
                  {new Date(p.dateNaissance).toLocaleDateString()}
                </td>
                <td className="p-3">{p.telephone ?? "-"}</td>
                <td className="p-3">{p.adresse ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
