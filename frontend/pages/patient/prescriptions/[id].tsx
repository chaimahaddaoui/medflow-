import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Doctor = { id: number; nom: string; prenom: string };
type Prescription = {
  id: number;
  createdAt: string;
  medicaments: string;
  notes?: string | null;
  doctor: Doctor;
};

export default function PrescriptionDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/patients/prescriptions/${id}`);
        if (!res.ok) {
          setMsg("Erreur lors du chargement de l'ordonnance.");
          return;
        }
        const data = await res.json();
        setPrescription(data.prescription);
      } catch (e) {
        console.error(e);
        setMsg("Erreur lors du chargement de l'ordonnance.");
      }
    })();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!id) return;
    const res = await fetch(`/api/patients/prescriptions/${id}/pdf`);
    if (!res.ok) {
      alert("Erreur lors du téléchargement du PDF.");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ordonnance-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (msg) return <div className="p-6 text-red-600">{msg}</div>;
  if (!prescription) return <div className="p-6">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
       {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/patient">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
      <main className="flex-1 p-6 max-w-3xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Ordonnance #{prescription.id}
        </h1>

        <div className="flex justify-between text-sm mb-4">
          <span className="font-semibold text-blue-800">
            Dr {prescription.doctor.nom} {prescription.doctor.prenom}
          </span>
          <span className="text-gray-500">
            {new Date(prescription.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>

        <h2 className="font-semibold text-sm mb-2">Médicaments</h2>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {prescription.medicaments}
        </p>

        {prescription.notes && (
          <>
            <h2 className="font-semibold text-sm mt-4 mb-2">Notes</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {prescription.notes}
            </p>
          </>
        )}

        <button
          onClick={handleDownloadPdf}
          className="mt-6 inline-flex px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-500"
        >
          Télécharger en PDF
        </button>
      </main>
      
    </div>
  );
}
