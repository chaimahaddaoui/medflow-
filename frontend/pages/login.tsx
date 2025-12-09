import { useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Erreur de connexion.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "patient") router.push("/patient");
    else if (data.role === "doctor") router.push("/doctor");
    else if (data.role === "receptionist") router.push("/receptionist");
    else if (data.role === "admin") router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* 🔙 Bouton retour */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-blue-700 hover:text-blue-900 font-medium mb-4"
        >
          ← Retour à l’accueil
        </button>

        <h1 className="text-2xl font-bold text-blue-900 text-center mb-2">
          Bienvenue 
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Connectez-vous pour accéder à votre espace.
        </p>

        {msg && (
          <div className="text-sm text-red-600 font-semibold mb-4 bg-red-50 p-2 rounded">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
              <AiOutlineMail className="text-gray-500 text-lg mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
              <RiLockPasswordLine className="text-gray-500 text-lg mr-2" />

              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="text-gray-600 ml-2"
              >
                {showPwd ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white font-semibold py-2 rounded-lg text-sm shadow-md disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
