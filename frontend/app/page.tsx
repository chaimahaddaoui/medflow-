// app/page.tsx (ou pages/index.tsx)
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Barre de navigation */}
      <header className="border-b border-blue-100 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-white shadow-sm">
              M
            </div>
            <span className="text-xl font-semibold tracking-tight text-blue-900">
              MedFlow
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="#features"
              className="hidden md:inline-block text-blue-700 hover:text-blue-900 transition"
            >
              Fonctionnalités
            </Link>
        
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg border-2 border-blue-400 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 shadow-md transition"
            >
              S&apos;inscrire
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero - centré et simplifié */}
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <section>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-600 mb-4 font-medium">
            Plateforme de gestion médicale
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-blue-900">
            Simplifiez la prise de rendez-vous
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              pour vos patients et vos équipes
            </span>
          </h1>
          <p className="text-base md:text-lg text-blue-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            MedFlow connecte patients, médecins et réceptionnistes dans une
            seule interface claire. Gérez vos rendez-vous, suivez vos visites
            et consultez vos ordonnances en toute simplicité.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg transition"
            >
              Accéder à mon espace
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg border-2 border-blue-300 text-blue-700 font-medium hover:bg-blue-50 transition"
            >
              Créer un compte patient
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-sm text-blue-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Rendez-vous en ligne 24/7
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Suivi des ordonnances
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Vue dédiée pour réceptionnistes
            </div>
          </div>
        </section>

        {/* Section fonctionnalités */}
        <section
          id="features"
          className="mt-20 grid md:grid-cols-3 gap-6 text-left"
        >
          <div className="bg-white/60 backdrop-blur border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold mb-3">
              P
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">
              Pour les patients
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              Prenez rendez-vous en quelques clics, consultez l&apos;historique
              de vos visites et accédez à vos ordonnances depuis votre espace
              personnel.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold mb-3">
              M
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">
              Pour les médecins
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              Visualisez votre planning, gérez les consultations et créez des
              ordonnances numériques pour un suivi patient optimisé.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold mb-3">
              R
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">
              Pour la réception
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              Gérez l&apos;ensemble des rendez-vous de la clinique, confirmez
              et annulez en temps réel avec une vue globale sur chaque médecin.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 mt-16 bg-white/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-5 text-xs text-blue-600 flex flex-col md:flex-row justify-between gap-2 items-center">
          <span>© {new Date().getFullYear()} MedFlow. Tous droits réservés.</span>
          <span> Gestion des cliniques médicales</span>
        </div>
      </footer>
    </div>
  );
}
