import { useEffect, useState } from "react";

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
