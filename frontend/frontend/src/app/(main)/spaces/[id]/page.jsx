"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const SPACE = {
  id: "1",
  code: "SB-201",
  name: "Laboratorio de Sistemas",
  area: "Edificio SB",
  floor: 2,
  capacity: 30,
  type: "Laboratorio",
  status: "operational",
  hasAC: true,
  hasProjector: true,
  hasComputers: true,
  hasInternet: true,
  description:
    "Laboratorio equipado con 30 computadores de alto rendimiento. Ideal para clases de programación, bases de datos y redes de computadores.",
  schedule: [
    { day: "Lun", opens: "07:00", closes: "20:00" },
    { day: "Mar", opens: "07:00", closes: "20:00" },
    { day: "Mié", opens: "07:00", closes: "20:00" },
    { day: "Jue", opens: "07:00", closes: "20:00" },
    { day: "Vie", opens: "07:00", closes: "18:00" },
    { day: "Sáb", opens: "08:00", closes: "14:00" },
  ],
};

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const RESERVED = {
  "2025-04-14": [8, 9, 13, 14, 15],
  "2025-04-15": [10, 11, 12],
  "2025-04-16": [7, 8, 16, 17],
};

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getWeekDays(baseDate) {
  const days = [];
  const dow = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - dow + (dow === 0 ? -6 : 1));
  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function fmt(date) {
  return date.toISOString().split("T")[0];
}

function Amenity({ label, active, icon }) {
  return (
    <div
      className="flex items-center gap-2 p-3 rounded-xl"
      style={{ background: active ? "#EAFAF1" : "#F9FAFB", opacity: active ? 1 : 0.5 }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium" style={{ color: active ? "#1E8449" : "#9CA3AF" }}>
        {label}
      </span>
      {active && (
        <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="7" fill="#1E8449" />
          <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export default function SpaceDetailPage() {
  const today = new Date();
  const [baseDate, setBaseDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(fmt(today));
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const weekDays = getWeekDays(baseDate);
  const reserved = RESERVED[selectedDate] || [];

  const prevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  };

  const nextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  };

  const handleHourClick = (hour) => {
    if (reserved.includes(hour)) return;
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(hour);
      setSelectedEnd(null);
    } else {
      if (hour > selectedStart) {
        setSelectedEnd(hour + 1);
      } else {
        setSelectedStart(hour);
        setSelectedEnd(null);
      }
    }
  };

  const isSelected = (hour) => {
    if (!selectedStart) return false;
    if (!selectedEnd) return hour === selectedStart;
    return hour >= selectedStart && hour < selectedEnd;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header active="spaces" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/spaces" className="hover:text-gray-700 transition-colors">
            Espacios
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{SPACE.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda — info del espacio */}
          <div className="lg:col-span-1 space-y-5">
            {/* Tarjeta principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div
                className="h-36 flex flex-col items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EAFAF1 0%, #D5F5E3 100%)" }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#D5F5E3" />
                  <path d="M16 12h16M19 12v9l-6 12h22l-6-12V12" stroke="#1E8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="21" cy="31" r="1.5" fill="#1E8449" />
                  <circle cx="27" cy="31" r="1.5" fill="#1E8449" />
                </svg>
                <span
                  className="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "#D5F5E3", color: "#1E8449" }}
                >
                  Disponible
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{SPACE.name}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {SPACE.code} · {SPACE.area}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ background: "#EAFAF1", color: "#1E8449", border: "1px solid #A9DFBF" }}
                  >
                    {SPACE.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {SPACE.description}
                </p>

                {/* Capacidad */}
                <div
                  className="flex items-center gap-3 mt-4 p-3 rounded-xl"
                  style={{ background: "#F9FAFB" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="3" stroke="#6B7280" strokeWidth="1.5" />
                    <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400">Capacidad máxima</p>
                    <p className="text-sm font-bold text-gray-900">{SPACE.capacity} personas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenidades */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Equipamiento</h3>
              <div className="space-y-2">
                <Amenity label="Aire acondicionado" active={SPACE.hasAC} icon="❄️" />
                <Amenity label="Video proyector" active={SPACE.hasProjector} icon="📽️" />
                <Amenity label="Computadores" active={SPACE.hasComputers} icon="💻" />
                <Amenity label="Internet" active={SPACE.hasInternet} icon="🌐" />
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Horario de atención</h3>
              <div className="space-y-2">
                {SPACE.schedule.map((s) => (
                  <div key={s.day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium w-10">{s.day}</span>
                    <span className="text-gray-700">{s.opens} – {s.closes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha — disponibilidad */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-lg">Disponibilidad</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevWeek}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M8 2L4 6l4 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={nextWeek}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4 2l4 4-4 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Selector de días */}
              <div className="grid grid-cols-6 gap-2 mb-6">
                {weekDays.map((d) => {
                  const key = fmt(d);
                  const isSelected = selectedDate === key;
                  const isToday = fmt(new Date()) === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedDate(key);
                        setSelectedStart(null);
                        setSelectedEnd(null);
                      }}
                      className="flex flex-col items-center py-3 rounded-xl transition-all"
                      style={
                        isSelected
                          ? { background: "#C0392B", color: "white" }
                          : isToday
                          ? { background: "#FDEDEC", color: "#C0392B", border: "1px solid #F1948A" }
                          : { background: "#F9FAFB", color: "#6B7280" }
                      }
                    >
                      <span className="text-xs font-medium">
                        {DAYS_OF_WEEK[d.getDay()]}
                      </span>
                      <span className="text-lg font-bold mt-0.5">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Grid de horas */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200 inline-block" />
                    Disponible
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 inline-block" />
                    Reservado
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#C0392B" }} />
                    Seleccionado
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {HOURS.map((hour) => {
                    const isRes = reserved.includes(hour);
                    const isSel = isSelected(hour);
                    return (
                      <button
                        key={hour}
                        onClick={() => handleHourClick(hour)}
                        disabled={isRes}
                        className="flex flex-col items-center py-3 rounded-xl text-xs font-medium transition-all"
                        style={
                          isSel
                            ? { background: "#C0392B", color: "white" }
                            : isRes
                            ? { background: "#FDEDEC", color: "#F1948A", cursor: "not-allowed" }
                            : { background: "#F9FAFB", color: "#374151" }
                        }
                      >
                        <span className="font-bold">{hour}:00</span>
                        <span className="text-[10px] opacity-70 mt-0.5">
                          {isRes ? "Ocupado" : "Libre"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instrucción */}
              {!selectedStart && (
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Haz clic en una hora para comenzar a seleccionar tu bloque de tiempo
                </p>
              )}
              {selectedStart && !selectedEnd && (
                <p className="text-xs mt-4 text-center font-medium" style={{ color: "#C0392B" }}>
                  Hora de inicio: {selectedStart}:00 — Ahora selecciona la hora de fin
                </p>
              )}
            </div>

            {/* Panel de reserva */}
            {selectedStart && selectedEnd && (
              <div
                className="bg-white rounded-2xl shadow-sm border p-6"
                style={{ borderColor: "#F1948A" }}
              >
                <h3 className="font-bold text-gray-900 mb-4">Resumen de la reserva</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400">Espacio</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{SPACE.name}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400">Fecha</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{selectedDate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-400">Horario</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {selectedStart}:00 – {selectedEnd}:00
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
                  style={{ background: "#C0392B" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
                >
                  Confirmar reserva
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#D5F5E3" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l6 6 14-14" stroke="#1E8449" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Reserva confirmada!</h3>
            <p className="text-gray-500 text-sm mb-1">
              <strong>{SPACE.name}</strong>
            </p>
            <p className="text-gray-500 text-sm mb-1">{selectedDate}</p>
            <p className="text-gray-500 text-sm mb-6">
              {selectedStart}:00 – {selectedEnd}:00
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Recibirás una confirmación en tu correo institucional
            </p>
            <Link href="/reservations">
              <button
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm"
                style={{ background: "#C0392B" }}
              >
                Ver mis reservas
              </button>
            </Link>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl text-gray-500 font-medium text-sm mt-2 hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
