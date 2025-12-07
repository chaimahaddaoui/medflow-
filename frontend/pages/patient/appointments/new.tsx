// pages/patient/appointments/new.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

type Doctor = {
  id: number;
  nom: string;
  prenom: string;
};

type CalendarDayAPI = {
  date: string; // "2025-11-03"
  status: "available" | "busy" | "blocked";
};

type CalendarDayUI = {
  date: string;
  status: "available" | "busy" | "blocked" | "none";
};

type DayAppointment = {
  id: number;
  heure: string;
};

export default function PatientNewAppointmentPage() {
  // TODO: remplacer par l'id du patient connecté
  const patientId = 1;

  const router = useRouter();
  const initialDoctorId = router.query.doctorId as string | undefined;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || ""
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [calendarFromAPI, setCalendarFromAPI] = useState<CalendarDayAPI[]>([]);
  const [dayAppointments, setDayAppointments] = useState<DayAppointment[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const TIMES = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  // Charger les médecins
  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => setDoctors(d.doctors ?? []))
      .catch(() => setMsg("Erreur chargement des médecins."));
  }, []);

  // Charger le calendrier du médecin
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

  // Construire les jours du mois
  const calendarDays: CalendarDayUI[] = useMemo(() => {
    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const m = Number(monthStr);
    const numDays = new Date(year, m, 0).getDate();

    const mapAPI = new Map(calendarFromAPI.map((d) => [d.date, d.status]));

    const days: CalendarDayUI[] = [];
    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const statusFromAPI = mapAPI.get(dateStr);
      let status: CalendarDayUI["status"] = "none";
      if (statusFromAPI === "available") status = "available";
      else if (statusFromAPI === "busy" || statusFromAPI === "blocked")
        status = "busy";
      days.push({ date: dateStr, status });
    }
    return days;
  }, [month, calendarFromAPI]);

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
    setLoading(true);
    fetch(
      `/api/doctors/agenda?doctorId=${selectedDoctorId}&date=${encodeURIComponent(
        date
      )}`
    )
      .then((r) => r.json())
      .then((d) => setDayAppointments(d.appointments ?? []))
      .catch(() =>
        setMsg("Erreur lors du chargement des rendez-vous de cette date.")
      )
      .finally(() => setLoading(false));
  };

  const handleClickDay = (day: CalendarDayUI) => {
    if (day.status === "busy") return;
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
    return isSelected
      ? "bg-blue-600 text-white border-blue-700"
      : "bg-gray-100 text-gray-500 border-gray-300";
  };

  const isTaken = (time: string) =>
    dayAppointments.some((a) => a.heure === time);

  const handleCreateAppointment = async () => {
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      setMsg("Choisissez un médecin, une date et une heure.");
      return;
    }
    setMsg("");
    setLoading(true);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        doctorId: Number(selectedDoctorId),
        date: selectedDate,
        heure: selectedTime,
        statut: "En attente",
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMsg(data.error || "Erreur lors de la création du rendez-vous.");
      return;
    }

    setMsg("Rendez-vous créé avec succès.");
    setSelectedDate(null);
    setSelectedTime(null);
    setDayAppointments([]);

    // Optionnel : rediriger vers la liste des RDV patient
    // router.push("/patient/appointments");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          Prendre un rendez-vous
        </h1>

        {msg && (
          <div className="mb-4 text-sm font-semibold text-red-600">{msg}</div>
        )}

        {/* Sélection du médecin si pas de doctorId dans l’URL */}
        <section className="bg-white rounded shadow p-4 mb-6">
          <label className="block text-sm font-medium mb-1">
            Médecin
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              setSelectedDate(null);
              setSelectedTime(null);
              setDayAppointments([]);
            }}
          >
            <option value="">-- Choisir un médecin --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nom} {d.prenom}
              </option>
            ))}
          </select>
        </section>

        {/* Calendrier + créneaux */}
        {selectedDoctorId && (
          <section className="bg-white rounded shadow p-4 space-y-4">
            {/* Calendrier */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold text-blue-900">
                  Calendrier du médecin ({month})
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={goPrevMonth}
                    className="px-2 py-1 border rounded"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={goNextMonth}
                    className="px-2 py-1 border rounded"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="flex gap-4 text-xs mb-2">
                <span>
                  <span className="inline-block w-3 h-3 rounded-full bg-green-300 mr-1" />
                  Jour disponible
                </span>
                <span>
                  <span className="inline-block w-3 h-3 rounded-full bg-red-300 mr-1" />
                  Jour complet / indisponible
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs">
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => handleClickDay(day)}
                    className={`px-2 py-2 rounded border text-center ${getDayClasses(
                      day
                    )}`}
                  >
                    {day.date.slice(8, 10)}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs text-gray-600">
                Date sélectionnée :{" "}
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("fr-FR")
                  : "aucune"}
              </p>
            </div>

            {/* Créneaux horaires */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                Créneaux disponibles
              </h3>
              {!selectedDate ? (
                <p className="text-xs text-gray-500">
                  Choisissez d’abord un jour dans le calendrier.
                </p>
              ) : loading ? (
                <p className="text-xs text-gray-500">
                  Chargement des créneaux...
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((time) => {
                    const taken = isTaken(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={taken}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-1 rounded text-xs border ${
                          taken
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-white hover:bg-blue-50"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bouton de confirmation */}
            {selectedDate && selectedTime && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCreateAppointment}
                  className="bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-800 disabled:opacity-60"
                >
                  Confirmer le rendez-vous
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
