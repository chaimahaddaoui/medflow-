import Link from "next/link";
import { useEffect, useState } from "react";

type Specialite = {
  id: number;
  label: string;
  description?: string | null;
};

type Doctor = {
  id: number;
  nom: string;
  prenom?: string | null;
  specialite?: Specialite | null; // objet Speciality, cf. Prisma
};

type Clinic = {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  logo?: string | null;
  horaires?: string | null;
  specialites: Specialite[];
  doctors?: Doctor[];
};

export default function PatientClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/clinics")
      .then((r) => r.json())
      .then((d) => setClinics(d.clinics ?? []))
      .catch(() =>
        setMsg(
          "Erreur lors du chargement des cliniques, spécialités et médecins."
        )
      );
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Cliniques, spécialités & médecins
        </h1>
         {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/patient">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>

        {msg && <div className="mb-4 text-red-600 font-bold">{msg}</div>}

        <div className="space-y-4">
          {clinics.map((clinic) => {
            const doctors = clinic.doctors ?? [];

            return (
              <div
                key={clinic.id}
                className="bg-white rounded shadow p-4 border border-gray-100"
              >
                {/* Infos clinique */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-800">
                      {clinic.nom}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {clinic.adresse} • {clinic.telephone} • {clinic.email}
                    </p>
                    {clinic.horaires && (
                      <p className="text-xs text-gray-400">
                        Horaires : {clinic.horaires}
                      </p>
                    )}
                  </div>
                </div>

                {/* Spécialités */}
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Spécialités disponibles
                </h3>
                {clinic.specialites.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucune spécialité enregistrée pour cette clinique.
                  </p>
                ) : (
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-3">
                    {clinic.specialites.map((sp) => (
                      <li key={sp.id}>
                        <span className="font-medium">{sp.label}</span>
                        {sp.description && (
                          <span className="text-xs text-gray-500">
                            {" "}
                            — {sp.description}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Médecins */}
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Médecins de cette clinique
                </h3>
                {doctors.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucun médecin enregistré pour cette clinique.
                  </p>
                ) : (
                  <table className="w-full text-left text-sm mt-1">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="py-1">Médecin</th>
                        <th className="py-1">Spécialité</th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc.id} className="border-t">
                          <td className="py-1">
                            {doc.nom} {doc.prenom || ""}
                          </td>
                          <td className="py-1">
                            {doc.specialite && doc.specialite.label
                              ? doc.specialite.label
                              : "—"}
                          </td>
                          <td className="py-1 text-right">
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
          
        </div>
      </main>
     
    </div>
  );
}
