// pages/patient/index.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function PatientDashboard() {
  const router = useRouter();
  const patientId = 1; 

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Erreur logout:", e);
    }
    
    router.push("/login");
  };

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
          <SidebarLink href="/patient/appointments" label="Mes rendez-vous" />
          <SidebarLink
            href="/patient/appointments/new"
            label="Prendre un rendez-vous"
          />
          <SidebarLink href="/patient/prescriptions" label="Mes ordonnances" />
        </nav>

        <div className="px-4 py-3 border-t border-blue-600 text-xs flex items-center justify-between">
          <span>
            Connecté en tant que{" "}
            <span className="font-semibold">Patient #{patientId}</span>
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
        {/* Top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-blue-900">
            Dashboard patient
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              Bonjour, Cher patient 
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Cartes en haut */}
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
              title="Rendez-vous à venir"
              value="-"
              color="from-blue-500 to-blue-700"
            />
            <StatCard
              title="Rendez-vous confirmés"
              value="-"
              color="from-indigo-500 to-indigo-700"
            />
            <StatCard
              title="Ordonnances"
              value="-"
              color="from-purple-500 to-purple-700"
            />
            <StatCard
              title="Cliniques suivies"
              value="-"
              color="from-emerald-500 to-emerald-700"
            />
          </section>

          {/* Prochains rendez-vous */}
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Prochains rendez-vous
            </h2>
            <p className="text-sm text-gray-500">
              Bientôt : liste de vos prochains rendez-vous (en attente /
              confirmés).
            </p>
          </section>

          {/* Ordonnances récentes */}
          <section className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Dernières ordonnances
            </h2>
            <p className="text-sm text-gray-500">
              Bientôt : aperçu des dernières ordonnances préparées par vos
              médecins.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

type SidebarLinkProps = {
  href: string;
  label: string;
};

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

type StatCardProps = {
  title: string;
  value: string | number;
  color: string;
};

function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div
      className={`rounded-xl text-white p-4 shadow bg-gradient-to-r ${color}`}
    >
      <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
        {title}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
