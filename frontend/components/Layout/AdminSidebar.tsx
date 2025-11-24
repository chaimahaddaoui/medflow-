// components/Layout/AdminSidebar.tsx
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="fixed h-screen w-64 bg-blue-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-blue-700">MedFlow</div>
      <nav className="flex-1 mt-4 flex flex-col space-y-4 px-6">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/patients">Patients</Link>
        <Link href="/admin/doctors">Médecins</Link>
        <Link href="/admin/appointments">Rendez-vous</Link>
        <Link href="/admin/bills">Factures</Link>
        <Link href="/admin/reports">Statistiques</Link>
        <Link href="/admin/users">Utilisateurs</Link>
      </nav>
      <button className="m-6 p-2 rounded bg-blue-700 hover:bg-blue-800">Se déconnecter</button>
    </aside>
  );
}
