import { useEffect, useState } from "react";
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
