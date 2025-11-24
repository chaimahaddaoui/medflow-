// components/Dashboard/NotificationsCard.tsx
export default function NotificationsCard() {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Notifications</div>
      <ul className="text-sm text-gray-700">
        <li>Patient retardé ce matin</li>
        <li>Nouvelle facture à valider</li>
      </ul>
    </div>
  );
}
