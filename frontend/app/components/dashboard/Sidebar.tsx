/* import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/patients", label: "Patients" },
    { href: "/dashboard/admin/doctors", label: "Médecins" },
    { href: "/dashboard/admin/appointments", label: "Rendez-vous" },
   
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
      <div className="p-5 border-b">
        <h1 className="text-2xl font-bold text-blue-600">MedFlow</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded ${
              pathname === link.href
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-blue-50 text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/admin", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/admin/patients", label: "Patients", icon: <Users size={18} /> },
    { href: "/dashboard/admin/doctors", label: "Médecins", icon: <Stethoscope size={18} /> },
    { href: "/dashboard/admin/appointments", label: "Rendez-vous", icon: <Calendar size={18} /> },
    { href: "/dashboard/admin/settings", label: "Paramètres", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col justify-between">
      {/* Logo + Navigation */}
      <div>
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-blue-600">MedFlow</h1>
          <p className="text-sm text-gray-500">Espace Administrateur</p>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                pathname === link.href
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Déconnexion */}
      <div className="p-4 border-t">
        <button className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition">
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
