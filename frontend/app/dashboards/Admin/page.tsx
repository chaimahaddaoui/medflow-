"use client";
import Layout from "@/app/components/dashboard/Layout";
import StatsCard from "@/app/components/dashboard/StatsCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const recentPatients = [
  { name: "Sami Ben Ali", email: "sami@example.com", date: "05/11/2025" },
  { name: "Amira Trabelsi", email: "amira@example.com", date: "03/11/2025" },
  { name: "Youssef Khemiri", email: "youssef@example.com", date: "01/11/2025" },
];

const statsData = [
  { name: "Nov", patients: 36 },
  { name: "Déc", patients: 48 }
];

export default function AdminDashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-extrabold mb-4 text-blue-700 flex items-center gap-2">
        <span role="img" aria-label="wave"></span> Bienvenue, Admin
      </h1>
      
      {/* Section Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Patients" value="124" color="emerald" icon={undefined} />
        <StatsCard title="Médecins" value="12" color="indigo" icon={undefined} />
        <StatsCard title="Rendez-vous du jour" value="8" color="yellow" icon={undefined} />
        <StatsCard title="Services" value="6" color="cyan" icon={undefined} />
      </div>

      {/* Graphique d'évolution */}
      <section className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Évolution des patients</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={statsData} barGap={6}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="patients" fill="#2563eb" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Tableau patients récents */}
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Derniers patients
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Nom</th>
                <th>Email</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p) => (
                <tr key={p.email} className="border-b hover:bg-gray-50">
                  <td className="py-2">{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.date}</td>
                  <td>
                    <button className="text-blue-600 hover:underline mr-3">Voir</button>
                    <button className="text-red-500 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
