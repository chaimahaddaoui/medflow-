
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewPatientReception() {
  const [clinics, setClinics] = useState<Array<{ id: number; nom: string }>>([]);
  const [form, setForm] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    dateNaissance: '', 
    telephone: '', 
    adresse: '',
    clinicId: ''
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Charge les cliniques au montage
  useEffect(() => {
    fetch('/api/clinics')
      .then(r => r.json())
      .then(d => setClinics(d.clinics ?? []))
      
      .catch(() => setMsg('Erreur chargement des cliniques'));
  }, []);

  const handleChange = (e: any) => 
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/patients", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({
          ...form,
          clinicId: form.clinicId ? Number(form.clinicId) : null
        })
      });
      
      if (res.ok) {
        window.location.href = "/receptionist/patients";
      } else {
        const error = await res.json();
        setMsg(error.detail || "Erreur d'enregistrement !");
      }
    } catch (err) {
      setMsg("Erreur lors de la création du patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/receptionist">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
      <h1 className="text-xl font-bold mb-4 text-blue-800">Nouveau patient</h1>
      
      {msg && (
        <div className="bg-red-100 rounded text-red-700 mb-2 px-3 py-2">
          {msg}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input 
          name="nom" 
          required 
          className="border p-2 rounded w-full" 
          placeholder="Nom" 
          onChange={handleChange}
          value={form.nom}
        />
        
        <input 
          name="prenom" 
          required 
          className="border p-2 rounded w-full" 
          placeholder="Prénom" 
          onChange={handleChange}
          value={form.prenom}
        />
        
        <input 
          name="email" 
          required 
          type="email" 
          className="border p-2 rounded w-full" 
          placeholder="Email" 
          onChange={handleChange}
          value={form.email}
        />
        
        <input 
          name="dateNaissance" 
          required 
          type="date" 
          className="border p-2 rounded w-full" 
          onChange={handleChange}
          value={form.dateNaissance}
        />
        
        <input 
          name="telephone" 
          className="border p-2 rounded w-full" 
          placeholder="Téléphone" 
          onChange={handleChange}
          value={form.telephone}
        />
        
        <input 
          name="adresse" 
          className="border p-2 rounded w-full" 
          placeholder="Adresse" 
          onChange={handleChange}
          value={form.adresse}
        />
        
        <select 
          name="clinicId"
          required
          className="border p-2 rounded w-full"
          onChange={handleChange}
          value={form.clinicId}
        >
          <option value="">Sélectionner une clinique</option>
          {clinics.map(c => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
        
        <button 
          className="bg-green-700 text-white font-bold px-4 py-2 rounded mt-2 w-full hover:bg-green-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
