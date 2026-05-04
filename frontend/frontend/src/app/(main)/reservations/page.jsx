"use client";

import { useState } from "react";
import Link from "next/link";

const RESERVATIONS = [
  {
    id: "r1",
    space: "Laboratorio de Sistemas",
    code: "SB-201",
    type: "Laboratorio",
    date: "2025-04-14",
    start: 8,
    end: 10,
    status: "confirmed",
    createdAt: "2025-04-10",
  },
  {
    id: "r2",
    space: "Aula 101",
    code: "SB-101",
    type: "Aula",
    date: "2025-04-16",
    start: 14,
    end: 16,
    status: "confirmed",
    createdAt: "2025-04-11",
  },
  {
    id: "r3",
    space: "Sala de Conferencias A",
    code: "SB-301",
    type: "Auditorio",
    date: "2025-04-05",
    start: 9,
    end: 12,
    status: "cancelled",
    createdAt: "2025-04-01",
  },
  {
    id: "r4",
    space: "Aula 102",
    code: "SB-102",
    type: "Aula",
    date: "2025-03-28",
    start: 10,
    end: 11,
    status: "cancelled",
    createdAt: "2025-03-25",
  },
  {
    id: "r5",
    space: "Laboratorio de Redes",
    code: "SB-202",
    type: "Laboratorio",
    date: "2025-03-20",
    start: 13,
    end: 15,
    status: "confirmed",
    createdAt: "2025-03-18",
  },
];

const typeColors = {
  Aula: { bg: "#EBF5FB", color: "#1A5276" },
  Laboratorio: { bg: "#EAFAF1", color: "#1E8449" },
  Auditorio: { bg: "#FEF9E7", color: "#9A7D0A" },
};

const today = new Date().toISOString().split("T")[0];

function StatusBadge({ status }) {
  if (status === "confirmed") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "#D5F5E3", color: "#1E8449" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Confirmada
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: "#FDEDEC", color: "#C0392B" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
      Cancelada
    </span>
  );
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [cancelId, setCancelId] = useState(null);
  const [cancelled, setCancelled] = useState([]);

  const active = RESERVATIONS.filter(
    (r) => r.status === "confirmed" && r.date >= today && !cancelled.includes(r.id)
  );
  const history = RESERVATIONS.filter(
    (r) =>
      r.status === "cancelled" ||
      r.date < today ||
      cancelled.includes(r.id)
  );

  const displayed = activeTab === "active" ? active : history;

  const handleCancel = () => {
    setCancelled([...cancelled, cancelId]);
    setCancelId(null);
  };

  return (
    <div>
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
            <p className="text-gray-500 mt-1">
              Gestiona todas tus reservas de espacios universitarios
            </p>
          </div>
          <Link href="/spaces">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
              style={{ background: "#C0392B" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Nueva reserva
            </button>
          </Link>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Reservas activas", value: active.length, color: "#C0392B", bg: "#FDEDEC" },
            { label: "Total realizadas", value: RESERVATIONS.length, color: "#1A5276", bg: "#EBF5FB" },
            { label: "Canceladas", value: RESERVATIONS.filter((r) => r.status === "cancelled").length + cancelled.length, color: "#9A7D0A", bg: "#FEF9E7" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { key: "active", label: `Activas (${active.length})` },
            { key: "history", label: `Historial (${history.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.key
                  ? { background: "#C0392B", color: "white" }
                  : { color: "#6B7280" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de reservas */}
        {displayed.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#FDEDEC" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="6" width="20" height="18" rx="3" stroke="#C0392B" strokeWidth="1.5" />
                <path d="M9 6V4M19 6V4" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 11h20" stroke="#C0392B" strokeWidth="1.5" />
                <path d="M9 16h10M9 20h6" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No tienes reservas {activeTab === "active" ? "activas" : "en el historial"}</p>
            {activeTab === "active" && (
              <Link href="/spaces">
                <button
                  className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ background: "#C0392B" }}
                >
                  Reservar un espacio
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((r) => {
              const tc = typeColors[r.type] || typeColors.Aula;
              const isCancelledNow = cancelled.includes(r.id);
              const effectiveStatus = isCancelledNow ? "cancelled" : r.status;
              const isActive = effectiveStatus === "confirmed" && r.date >= today;

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-5"
                >
                  {/* Tipo badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: tc.bg }}
                  >
                    <span className="text-xl">
                      {r.type === "Laboratorio" ? "🧪" : r.type === "Auditorio" ? "🏛️" : "📚"}
                    </span>
                  </div>

                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {r.space}
                      </h3>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: tc.bg, color: tc.color }}
                      >
                        {r.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{r.code}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M4 2V1M8 2V1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {r.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        {r.start}:00 – {r.end}:00
                      </span>
                    </div>
                  </div>

                  {/* Estado y acciones */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={effectiveStatus} />
                    {isActive && (
                      <button
                        onClick={() => setCancelId(r.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
                        style={{ borderColor: "#F1948A", color: "#C0392B" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#FDEDEC";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de cancelación */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#FDEDEC" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 9v6M14 18v1" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="14" r="11" stroke="#C0392B" strokeWidth="1.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ¿Cancelar esta reserva?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Esta acción no se puede deshacer. El espacio quedará disponible para otros usuarios.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                No cancelar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ background: "#C0392B" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
