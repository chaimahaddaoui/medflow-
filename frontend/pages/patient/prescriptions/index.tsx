// pages/patient/prescriptions/index.tsx
import Link from "next/link";
import { useEffect, useState } from "react";

type Doctor = {
  id: number;
  nom: string;
  prenom: string;
};

type Prescription = {
  id: number;
  createdAt: string;
  medicaments: string;
  notes?: string | null;
  doctor: Doctor;
};

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch("/api/patients/prescriptions");
        if (res.status === 401) {
          setMsg("Vous devez être connecté pour voir vos ordonnances.");
          return;
        }
        if (!res.ok) {
          setMsg("Erreur lors du chargement de vos ordonnances.");
          return;
        }
        const data = await res.json();
        setPrescriptions(data.prescriptions ?? []);
      } catch (e) {
        console.error(e);
        setMsg("Erreur lors du chargement de vos ordonnances.");
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-6 max-w-4xl mx-auto">
         {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/patient">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Mes ordonnances
        </h1>

        {msg && (
          <div className="mb-4 text-red-600 text-sm font-semibold">{msg}</div>
        )}

        {prescriptions.length === 0 && !msg ? (
          <p className="text-sm text-gray-600">
            Vous n&apos;avez pas encore d&apos;ordonnance.
          </p>
        ) : null}

        {prescriptions.length > 0 && (
          <div className="space-y-3">
            {prescriptions.map((p) => (
              <a
                key={p.id}
                href={`/patient/prescriptions/${p.id}`}
                className="block bg-white rounded shadow p-3 hover:bg-gray-50"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-blue-800">
                    Dr {p.doctor.nom} {p.doctor.prenom}
                  </span>
                  <span className="text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                  {p.medicaments}
                </p>
                {p.notes && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                    Notes : {p.notes}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
