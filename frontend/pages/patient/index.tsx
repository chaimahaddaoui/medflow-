// pages/patient/index.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Stats = {
  upcomingCount: number;
  confirmedCount: number;
  prescriptionsCount: number;
  clinicsCount: number;
};

type UpcomingAppointment = {
  id: number;
  date: string;
  heure: string | null;
  statut: string;
  doctor: string;
  clinic: string;
};

type LastPrescription = {
  id: number;
  date: string;
  doctor: string;
  notes: string | null;
};

export default function PatientDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([]);
  const [lastPrescriptions, setLastPrescriptions] = useState<LastPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Erreur logout:", e);
    }
    router.push("/login");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/patients/dashboard");

        // Non authentifié -> on renvoie vers la page de login
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          console.error("Erreur API dashboard:", res.status);
          return;
        }

        const data = await res.json();
        setStats(data.stats);
        setUpcoming(data.upcomingAppointments);
        setLastPrescriptions(data.lastPrescriptions);
      } catch (e) {
        console.error("Erreur fetch dashboard:", e);
      } finally {
        // Très important pour arrêter l'affichage "Chargement..."
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold border-b border-blue-600">
          MedFlow
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <SidebarLink href="/patient" label="Dashboard" />
          <SidebarLink href="/patient/clinics" label="Cliniques & médecins" />
         
          <SidebarLink href="/patient/appointments/new" label="Prendre un rendez-vous"/>
          <SidebarLink href="/patient/prescriptions" label="Mes ordonnances" />
          <SidebarLink href="/patient/bills" label="Mes factures" />
        </nav>

        <div className="px-4 py-3 border-t border-blue-600 text-xs flex items-center justify-between">
          <span>
            Connecté en tant que <span className="font-semibold">Patient</span>
          </span>
          <button
            onClick={handleLogout}
            className="ml-2 bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-blue-900">Dashboard patient</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Bonjour, Cher patient</span>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Cartes en haut */}
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
              title="Rendez-vous à venir"
              value={loading ? "..." : stats?.upcomingCount ?? 0}
              color="from-blue-500 to-blue-700"
            />
            <StatCard
              title="Rendez-vous confirmés"
              value={loading ? "..." : stats?.confirmedCount ?? 0}
              color="from-indigo-500 to-indigo-700"
            />
            <StatCard
              title="Ordonnances"
              value={loading ? "..." : stats?.prescriptionsCount ?? 0}
              color="from-purple-500 to-purple-700"
            />
            <StatCard
              title="Cliniques suivies"
              value={loading ? "..." : stats?.clinicsCount ?? 0}
              color="from-emerald-500 to-emerald-700"
            />
          </section>

          {/* Prochains rendez-vous */}
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Prochains rendez-vous
            </h2>
            {loading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : upcoming.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucun rendez-vous à venir.
              </p>
            ) : (
              <ul className="text-sm space-y-2">
                {upcoming.map((a) => (
                  <li key={a.id}>
                    {a.date} à {a.heure} – {a.doctor} ({a.clinic}) [{a.statut}]
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Ordonnances récentes */}
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Dernières ordonnances
            </h2>
            {loading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : lastPrescriptions.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucune ordonnance pour le moment.
              </p>
            ) : (
              <ul className="text-sm space-y-2">
                {lastPrescriptions.map((p) => (
                  <li key={p.id}>
                    {p.date} – {p.doctor}
                    {p.notes ? ` : ${p.notes}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

type SidebarLinkProps = { href: string; label: string };
function SidebarLink({ href, label }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition"
    >
      <span>{label}</span>
    </Link>
  );
}

type StatCardProps = { title: string; value: string | number; color: string };
function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className={`rounded-xl text-white p-4 shadow bg-gradient-to-r ${color}`}>
      <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
        {title}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
