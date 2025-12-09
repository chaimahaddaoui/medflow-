/* import { useEffect, useState } from "react";

type Bill = {
  id: number;
  montant: number;
  statut: string;
  dateCreation: string;
  patient: { id: number; nom: string; prenom: string };
  appointment?: { id: number; date: string };
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetch('/api/bills')
      .then(r => r.json())
      .then(d => setBills(d.bills ?? []));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Liste des factures</h2>

      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Patient</th>
            <th className="p-2">Montant (DT)</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Rendez-vous</th>
          </tr>
        </thead>

        <tbody>
          {bills.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                Aucune facture trouvée
              </td>
            </tr>
          )}

          {bills.map(bill => (
            <tr key={bill.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{new Date(bill.dateCreation).toLocaleDateString()}</td>
              <td className="p-2">{bill.patient?.nom} {bill.patient?.prenom}</td>
              <td className="p-2">{bill.montant}</td>
              <td className="p-2">{bill.statut}</td>
              <td className="p-2">
                {bill.appointment?.id
                  ? new Date(bill.appointment.date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 */
import { useEffect, useState } from "react";
import Link from "next/link";

type Bill = {
  id: number;
  montant: number;
  statut: string;
  dateCreation: string;
  patient: { id: number; nom: string; prenom: string };
  appointment?: { id: number; date: string };
};

const statutColors: Record<string, string> = {
  PAYEE: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  EN_ATTENTE: "bg-amber-100 text-amber-700 ring-amber-200",
  ANNULEE: "bg-rose-100 text-rose-700 ring-rose-200",
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetch("/api/bills")
      .then((r) => r.json())
      .then((d) => setBills(d.bills ?? []));
  }, []);

  const formatMontant = (m: number) =>
    new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 3,
    }).format(m);

  const getStatutClass = (statut: string) =>
    statutColors[statut] ??
    "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Page heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Facturation
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Liste des factures
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Visualisez l’historique des factures des patients, leurs montants et leurs statuts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 sm:inline">
              {bills.length} facture{bills.length > 1 ? "s" : ""}
            </span>

            <Link href="/admin">
              <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <span className="mr-2 text-lg">←</span>
                Retour au Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Table container */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
                    </th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Montant (DT)
                    </th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Statut
                    </th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Rendez-vous
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bills.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-400"
                      >
                        Aucune facture trouvée.
                        <br />
                        <span className="text-xs">
                          Les factures apparaîtront ici dès leur création.
                        </span>
                      </td>
                    </tr>
                  )}

                  {bills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="odd:bg-white even:bg-slate-50/60 hover:bg-emerald-50/40"
                    >
                      <td className="whitespace-nowrap px-3 py-2 align-middle text-sm text-slate-800">
                        {new Date(bill.dateCreation).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {bill.patient?.nom} {bill.patient?.prenom}
                          </span>
                          <span className="text-xs text-slate-500">
                            ID patient : #{bill.patient?.id}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right align-middle text-sm font-semibold text-slate-900">
                        {formatMontant(bill.montant)}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatutClass(
                            bill.statut
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {bill.statut}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 align-middle text-sm text-slate-700">
                        {bill.appointment?.id ? (
                          <div className="flex flex-col">
                            <span>
                              {new Date(
                                bill.appointment.date
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-slate-500">
                              RDV #{bill.appointment.id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
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
