// pages/patient/bills/index.tsx
import { useEffect, useState } from "react";

type AppointmentInfo = {
  id: number;
  date: string;
  heure: string | null;
  doctor: string;
} | null;

type Bill = {
  id: number;
  montant: number;
  statut: string;
  dateCreation: string;
  appointment: AppointmentInfo;
};

export default function PatientBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch("/api/patients/bills");
        if (res.status === 401) {
          setMsg("Vous devez être connecté pour voir vos factures.");
          return;
        }
        if (!res.ok) {
          setMsg("Erreur lors du chargement de vos factures.");
          return;
        }
        const data = await res.json();
        setBills(data.bills ?? []);
      } catch (e) {
        console.error(e);
        setMsg("Erreur lors du chargement de vos factures.");
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Mes factures
        </h1>

        {msg && (
          <div className="mb-4 text-red-600 text-sm font-semibold">{msg}</div>
        )}

        {bills.length === 0 && !msg ? (
          <p className="text-sm text-gray-600">
            Vous n&apos;avez pas encore de facture.
          </p>
        ) : null}

        {bills.length > 0 && (
          <div className="space-y-3">
            {bills.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded shadow p-3 flex justify-between items-center"
              >
                <div className="text-sm">
                  <div className="font-semibold text-blue-800">
                    Facture #{b.id} – {b.montant.toFixed(2)} DT
                  </div>
                  <div className="text-xs text-gray-500">
                    Émise le{" "}
                    {new Date(b.dateCreation).toLocaleDateString("fr-FR")}
                    {b.appointment && (
                      <>
                        {" "}
                        – RDV du{" "}
                        {new Date(b.appointment.date).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        à {b.appointment.heure} avec{" "}
                        {b.appointment.doctor}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs font-semibold">
                  {b.statut === "Payée" ? (
                    <span className="text-green-600">Payée</span>
                  ) : b.statut === "En attente" ? (
                    <span className="text-orange-500">En attente</span>
                  ) : (
                    <span className="text-gray-500">{b.statut}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
