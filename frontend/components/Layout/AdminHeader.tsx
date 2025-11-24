// components/Layout/AdminHeader.tsx
export default function AdminHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b ml-64 shadow">
      <div className="text-lg font-bold">Dashboard Admin</div>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Recherche…" className="border px-2 py-1 rounded" />
        <span className="material-icons text-gray-500">notifications</span>
        <span className="font-medium">Admin</span>
      </div>
    </header>
  );
}
