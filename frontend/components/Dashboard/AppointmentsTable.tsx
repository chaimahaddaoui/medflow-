// components/Dashboard/AppointmentsTable.tsx
export default function AppointmentsTable() {
  // Remplace par tes données dynamiques plus tard
  const rows = [
    { patient: 'Jean Durand', medecin: 'Dr. Martin', date: '12/11/2025', heure: '9:30', statut: 'Confirmé' },
    { patient: 'Alice Fabre', medecin: 'Dr. Simon', date: '12/11/2025', heure: '10:00', statut: 'En attente' },
  ];
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Prochains rendez-vous</div>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Patient</th><th>Médecin</th><th>Date</th><th>Heure</th><th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((rdv, idx) => (
            <tr key={idx} className="border-b last:border-none">
              <td>{rdv.patient}</td>
              <td>{rdv.medecin}</td>
              <td>{rdv.date}</td>
              <td>{rdv.heure}</td>
              <td>{rdv.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
