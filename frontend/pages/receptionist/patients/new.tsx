import { useState } from "react";

export default function NewPatientReception() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', dateNaissance: '', telephone: '', adresse: '' });
  const [msg, setMsg] = useState('');
  const handleChange = (e: any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) window.location.href = "/receptionist/patients";
    else setMsg("Erreur d'enregistrement !");
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-blue-800">Nouveau patient</h1>
      {msg && <div className="bg-red-100 rounded text-red-700 mb-2 px-3 py-2">{msg}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="nom" required className="border p-2 rounded w-full" placeholder="Nom" onChange={handleChange} />
        <input name="prenom" required className="border p-2 rounded w-full" placeholder="Prénom" onChange={handleChange} />
        <input name="email" required type="email" className="border p-2 rounded w-full" placeholder="Email" onChange={handleChange} />
        <input name="dateNaissance" required type="date" className="border p-2 rounded w-full" onChange={handleChange} />
        <input name="telephone" className="border p-2 rounded w-full" placeholder="Téléphone" onChange={handleChange} />
        <input name="adresse" className="border p-2 rounded w-full" placeholder="Adresse" onChange={handleChange} />
        <button className="bg-green-700 text-white font-bold px-4 py-2 rounded mt-2">Créer</button>
      </form>
    </div>
  );
}
