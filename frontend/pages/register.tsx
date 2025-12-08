// pages/register.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

type Clinic = {
  id: number;
  nom: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateNaissance: "",
    telephone: "",
    adresse: "",
    clinicId: "", // on garde l'id de la clinique choisie
  });

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les cliniques au montage
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch("/api/clinics");
        const data = await res.json();
        // data = { clinics: [...] } dans ton API
        setClinics(data.clinics || []);
      } catch (e) {
        console.error("Erreur chargement cliniques", e);
      }
    };

    fetchClinics();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    // Validation côté client
    if (form.password !== form.confirmPassword) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    if (form.password.length < 6) {
      setMsg("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!form.clinicId) {
      setMsg("Veuillez sélectionner une clinique.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          password: form.password,
          dateNaissance: form.dateNaissance,
          telephone: form.telephone || null,
          adresse: form.adresse || null,
          clinicId: Number(form.clinicId), // IMPORTANT : on envoie l'id de la clinique
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=1");
      } else {
        setMsg(data.detail || "Erreur lors de l'inscription.");
      }
    } catch (e) {
      console.error(e);
      setMsg("Erreur réseau lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-white shadow-sm">
              M
            </div>
            <span className="text-2xl font-bold text-blue-900">MedFlow</span>
          </Link>
          <p className="text-sm text-blue-600 mt-2">
            Créez votre compte patient
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/80 backdrop-blur border border-blue-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-xl font-bold text-blue-900 mb-4">
            Inscription patient
          </h1>

          {msg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  required
                  value={form.prenom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Marie"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="marie.dupont@example.com"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
              <p className="text-xs text-blue-600 mt-1">
                Minimum 6 caractères
              </p>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Confirmer le mot de passe{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateNaissance"
                required
                value={form.dateNaissance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="0612345678"
              />
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Adresse
              </label>
              <input
                type="text"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="123 Rue de la Santé, Paris"
              />
            </div>

            {/* Clinique (liste déroulante) */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Clinique
              </label>
              <select
                name="clinicId"
                value={form.clinicId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Sélectionnez une clinique</option>
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          {/* Lien connexion */}
          <p className="text-center text-sm text-blue-600 mt-4">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
