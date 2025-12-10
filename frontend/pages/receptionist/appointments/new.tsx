import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Patient = {
  id: number;
  nom: string;
  prenom: string;
};

type Doctor = {
  id: number;
  nom: string;
  prenom: string;
};

type CalendarDayAPI = {
  date: string;      // "2025-11-03"
  status: "available" | "busy" | "blocked";
};

type CalendarDayUI = {
  date: string;      // "2025-11-03"
  status: "available" | "busy" | "blocked" | "none";
};

type DayAppointment = {
  id: number;
  heure: string;     // "10:00"
};

export default function NewAppointmentReception() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Gestion du mois affiché dans le calendrier
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [calendarFromAPI, setCalendarFromAPI] = useState<CalendarDayAPI[]>([]);
  const [dayAppointments, setDayAppointments] = useState<DayAppointment[]>([]);
  const [msg, setMsg] = useState<string>("");

  const [loading, setLoading] = useState(false);

  // Créneaux fixes (à adapter si besoin)
  const TIMES = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  // Charger patients + médecins
  useEffect(() => {
    fetch("/api/patients")
      .then((r) => r.json())
      .then((d) => setPatients(d.patients ?? []))
      .catch(() => setMsg("Erreur chargement des patients."));

    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors ?? []))
      .catch(() => setMsg("Erreur chargement des médecins."));
  }, []);

  // Charger le calendrier du médecin sélectionné pour le mois courant
  useEffect(() => {
    if (!selectedDoctorId) {
      setCalendarFromAPI([]);
      return;
    }
    setMsg("");
    fetch(`/api/doctors/calendar?doctorId=${selectedDoctorId}&month=${month}`)
      .then((r) => r.json())
      .then((d) => setCalendarFromAPI(d.calendar ?? []))
      .catch(() =>
        setMsg("Erreur lors du chargement du calendrier du médecin.")
      );
  }, [selectedDoctorId, month]);

  // Construction des jours du mois (UI)
  const calendarDays: CalendarDayUI[] = useMemo(() => {
    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const m = Number(monthStr);
    const numDays = new Date(year, m, 0).getDate();

    const mapAPI = new Map(calendarFromAPI.map((d) => [d.date, d.status]));

    const days: CalendarDayUI[] = [];
    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const statusFromAPI = mapAPI.get(dateStr);
      let status: CalendarDayUI["status"] = "none";
      if (statusFromAPI === "available") status = "available";
      else if (statusFromAPI === "busy" || statusFromAPI === "blocked")
        status = "busy";
      days.push({ date: dateStr, status });
    }
    return days;
  }, [month, calendarFromAPI]);

  // Navigation mois précédent / suivant
  const goPrevMonth = () => {
    const [yearStr, monthStr] = month.split("-");
    const y = Number(yearStr);
    const m = Number(monthStr);
    const d = new Date(y, m - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    setSelectedDate(null);
    setSelectedTime(null);
    setDayAppointments([]);
  };

  const goNextMonth = () => {
    const [yearStr, monthStr] = month.split("-");
    const y = Number(yearStr);
    const m = Number(monthStr);
    const d = new Date(y, m, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    setSelectedDate(null);
    setSelectedTime(null);
    setDayAppointments([]);
  };

  // Charger les RDV du jour
  const loadDayAgenda = (date: string) => {
    if (!selectedDoctorId) {
      setMsg("Veuillez d'abord choisir un médecin.");
      return;
    }
    setMsg("");
    fetch(
      `/api/doctors/agenda?doctorId=${selectedDoctorId}&date=${encodeURIComponent(
        date
      )}`
    )
      .then((r) => r.json())
      .then((d) => setDayAppointments(d.appointments ?? []))
      .catch(() =>
        setMsg("Erreur lors du chargement des rendez-vous de cette date.")
      );
  };

  const handleClickDay = (day: CalendarDayUI) => {
    if (day.status === "busy") return; // jour complet / non dispo
    setSelectedDate(day.date);
    setSelectedTime(null);
    setDayAppointments([]);
    loadDayAgenda(day.date);
  };

  const getDayClasses = (day: CalendarDayUI) => {
    const isSelected = day.date === selectedDate;
    if (day.status === "available") {
      return isSelected
        ? "bg-blue-600 text-white border-blue-700"
        : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200";
    }
    if (day.status === "busy") {
      return "bg-red-100 text-red-500 cursor-not-allowed";
    }
    // none (non configuré)
    return isSelected
      ? "bg-blue-600 text-white border-blue-700"
      : "bg-gray-100 text-gray-500 border-gray-300";
  };

  // Savoir si un créneau est déjà pris
  const isTaken = (time: string) =>
    dayAppointments.some((a) => a.heure === time);

  // Création du rendez-vous
  const handleCreateAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !selectedDate || !selectedTime) {
      setMsg("Veuillez sélectionner un patient, un médecin, une date et une heure.");
      return;
    }
    try {
      setLoading(true);
      setMsg("");
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: Number(selectedPatientId),
          doctorId: Number(selectedDoctorId),
          date: selectedDate,
          heure: selectedTime,
        }),
      });
      if (res.ok) {
        window.location.href = "/receptionist/appointments";
      } else {
        const error = await res.json();
        setMsg(error.detail || "Erreur lors de la création du rendez-vous.");
      }
    } catch {
      setMsg("Erreur réseau lors de la création du rendez-vous.");
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* BOUTON RETOUR */}
    <div className="mb-6">
      <Link href="/receptionist">
        <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span className="mr-2 text-lg">←</span>
          Retour au Dashboard
        </button>
      </Link>
    </div>
        <h1 className="text-3xl font-bold mb-6">Créer un rendez-vous</h1>
  
        {msg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {msg}
          </div>
        )}
  
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.prenom} {p.nom}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-2">Médecin</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Sélectionner un médecin</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.prenom} {d.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {selectedDoctorId && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={goPrevMonth} className="px-4 py-2 bg-gray-300 rounded">
                  Précédent
                </button>
                <h2 className="text-xl font-semibold">{month}</h2>
                <button onClick={goNextMonth} className="px-4 py-2 bg-gray-300 rounded">
                  Suivant
                </button>
              </div>
  
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => handleClickDay(day)}
                    disabled={day.status === "busy"}
                    className={`p-3 border rounded text-center font-medium ${getDayClasses(
                      day
                    )}`}
                  >
                    {day.date.split("-")[2]}
                  </button>
                ))}
              </div>
            </div>
  
            {selectedDate && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Créneaux disponibles - {selectedDate}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      disabled={isTaken(time)}
                      className={`p-3 border rounded font-medium ${
                        selectedTime === time
                          ? "bg-blue-600 text-white border-blue-700"
                          : isTaken(time)
                          ? "bg-red-100 text-red-500 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
  
        <button
          onClick={handleCreateAppointment}
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Création en cours..." : "Créer le rendez-vous"}
        </button>
      </div>
    );
  }
