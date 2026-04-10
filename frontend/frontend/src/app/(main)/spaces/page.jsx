"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const SPACES = [
  { id: "1", code: "SB-101", name: "Aula 101", area: "Edificio SB", floor: 1, capacity: 40, type: "Aula", status: "operational", hasAC: true, hasProjector: true, hasComputers: false, hasInternet: true },
  { id: "2", code: "SB-102", name: "Aula 102", area: "Edificio SB", floor: 1, capacity: 35, type: "Aula", status: "operational", hasAC: false, hasProjector: true, hasComputers: false, hasInternet: true },
  { id: "3", code: "SB-201", name: "Laboratorio de Sistemas", area: "Edificio SB", floor: 2, capacity: 30, type: "Laboratorio", status: "operational", hasAC: true, hasProjector: true, hasComputers: true, hasInternet: true },
  { id: "4", code: "SB-202", name: "Laboratorio de Redes", area: "Edificio SB", floor: 2, capacity: 25, type: "Laboratorio", status: "maintenance", hasAC: true, hasProjector: false, hasComputers: true, hasInternet: true },
  { id: "5", code: "SB-301", name: "Sala de Conferencias A", area: "Edificio SB", floor: 3, capacity: 60, type: "Auditorio", status: "operational", hasAC: true, hasProjector: true, hasComputers: false, hasInternet: true },
  { id: "6", code: "SB-302", name: "Sala de Conferencias B", area: "Edificio SB", floor: 3, capacity: 80, type: "Auditorio", status: "operational", hasAC: true, hasProjector: true, hasComputers: false, hasInternet: true },
  { id: "7", code: "SB-401", name: "Aula de Postgrado", area: "Edificio SB", floor: 4, capacity: 20, type: "Aula", status: "operational", hasAC: true, hasProjector: true, hasComputers: false, hasInternet: true },
  { id: "8", code: "SB-402", name: "Laboratorio de Electrónica", area: "Edificio SB", floor: 4, capacity: 20, type: "Laboratorio", status: "operational", hasAC: false, hasProjector: false, hasComputers: false, hasInternet: false },
];

const typeColors = {
  Aula: { bg: "#EBF5FB", color: "#1A5276", border: "#AED6F1" },
  Laboratorio: { bg: "#EAFAF1", color: "#1E8449", border: "#A9DFBF" },
  Auditorio: { bg: "#FEF9E7", color: "#9A7D0A", border: "#F9E79F" },
};

function SpaceIcon({ type }) {
  if (type === "Laboratorio") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EAFAF1" />
        <path d="M11 8h10M13 8v6l-4 8h14l-4-8V8" stroke="#1E8449" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="22" r="1" fill="#1E8449" />
        <circle cx="18" cy="22" r="1" fill="#1E8449" />
      </svg>
    );
  }
  if (type === "Auditorio") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FEF9E7" />
        <path d="M6 24h20M8 24V16l8-6 8 6v8" stroke="#9A7D0A" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="13" y="18" width="6" height="6" rx="1" stroke="#9A7D0A" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#EBF5FB" />
      <rect x="7" y="10" width="18" height="14" rx="2" stroke="#1A5276" strokeWidth="1.5" />
      <path d="M7 14h18" stroke="#1A5276" strokeWidth="1.5" />
      <path d="M16 14v10" stroke="#1A5276" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function AmenityBadge({ label, active }) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {label}
    </span>
  );
}

export default function SpacesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const types = ["Todos", "Aula", "Laboratorio", "Auditorio"];
  const statuses = ["Todos", "Disponible", "Mantenimiento"];

  const filtered = SPACES.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "Todos" || s.type === typeFilter;
    const matchStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Disponible" && s.status === "operational") ||
      (statusFilter === "Mantenimiento" && s.status === "maintenance");
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header active="spaces" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado de página */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Catálogo de Espacios
          </h1>
          <p className="text-gray-500 mt-1">
            Consulta la disponibilidad y reserva el espacio que necesitas
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={
                      typeFilter === t
                        ? { background: "#C0392B", color: "white" }
                        : { color: "#6B7280" }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={
                      statusFilter === st
                        ? { background: "#C0392B", color: "white" }
                        : { color: "#6B7280" }
                    }
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conteo */}
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} espacio{filtered.length !== 1 ? "s" : ""} encontrado
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((space) => {
            const tc = typeColors[space.type] || typeColors.Aula;
            const isOp = space.status === "operational";
            return (
              <div
                key={space.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                {/* Encabezado de tarjeta */}
                <div
                  className="h-24 flex items-center justify-center relative"
                  style={{ background: tc.bg }}
                >
                  <SpaceIcon type={space.type} />
                  {/* Badge de piso */}
                  <span className="absolute top-3 left-3 text-xs font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                    Piso {space.floor}
                  </span>
                  {/* Badge de estado */}
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={
                      isOp
                        ? { background: "#D5F5E3", color: "#1E8449" }
                        : { background: "#FDEDEC", color: "#C0392B" }
                    }
                  >
                    {isOp ? "Disponible" : "Mantenimiento"}
                  </span>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {space.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{space.code}</p>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                      style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}
                    >
                      {space.type}
                    </span>
                  </div>

                  {/* Capacidad */}
                  <div className="flex items-center gap-1.5 mt-3 mb-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="5" r="2.5" stroke="#9CA3AF" strokeWidth="1.2" />
                      <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs text-gray-500">
                      Capacidad: <span className="font-semibold text-gray-700">{space.capacity} personas</span>
                    </span>
                  </div>

                  {/* Amenidades */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    <AmenityBadge label="A/C" active={space.hasAC} />
                    <AmenityBadge label="Proyector" active={space.hasProjector} />
                    <AmenityBadge label="Computadores" active={space.hasComputers} />
                    <AmenityBadge label="Internet" active={space.hasInternet} />
                  </div>

                  {/* Botón */}
                  <Link href={`/spaces/${space.id}`}>
                    <button
                      className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                      style={
                        isOp
                          ? { background: "#C0392B", color: "white" }
                          : { background: "#F3F4F6", color: "#9CA3AF", cursor: "not-allowed" }
                      }
                      disabled={!isOp}
                    >
                      {isOp ? "Ver disponibilidad" : "No disponible"}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No se encontraron espacios</p>
            <p className="text-gray-300 text-sm mt-1">Intenta con otros filtros</p>
          </div>
        )}
      </main>
    </div>
  );
}
