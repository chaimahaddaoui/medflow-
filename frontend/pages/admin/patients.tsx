import { useEffect, useState } from "react";
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
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data.patients ?? []));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce patient ?')) return;
    
    const res = await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="p-8">
      <Link href="/admin">
  <button className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
    ← Retour au Dashboard
  </button>
</Link>

      <h1 className="text-2xl font-bold mb-4">Liste des patients</h1>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Prénom</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Date naissance</th>
            <th className="p-3 text-left">Téléphone</th>
            <th className="p-3 text-left">Adresse</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                Aucun patient trouvé
              </td>
            </tr>
          )}
          {patients.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.nom}</td>
              <td className="p-3">{p.prenom}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{new Date(p.dateNaissance).toLocaleDateString()}</td>
              <td className="p-3">{p.telephone ?? '-'}</td>
              <td className="p-3">{p.adresse ?? '-'}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
