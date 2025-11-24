// components/Layout/AdminLayout.tsx
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader />
        <main className="p-8 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
