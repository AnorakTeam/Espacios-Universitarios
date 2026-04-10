"use client";

import { useState } from "react";

const SPACES = [
  { id: "1", code: "SB-101", name: "Aula 101", area: "Edificio SB", floor: 1, capacity: 40, type: "Aula", status: "operational", hasAC: true, hasProjector: true, hasComputers: false },
  { id: "2", code: "SB-102", name: "Aula 102", area: "Edificio SB", floor: 1, capacity: 35, type: "Aula", status: "operational", hasAC: false, hasProjector: true, hasComputers: false },
  { id: "3", code: "SB-201", name: "Laboratorio de Sistemas", area: "Edificio SB", floor: 2, capacity: 30, type: "Laboratorio", status: "operational", hasAC: true, hasProjector: true, hasComputers: true },
  { id: "4", code: "SB-202", name: "Laboratorio de Redes", area: "Edificio SB", floor: 2, capacity: 25, type: "Laboratorio", status: "maintenance", hasAC: true, hasProjector: false, hasComputers: true },
  { id: "5", code: "SB-301", name: "Sala de Conferencias A", area: "Edificio SB", floor: 3, capacity: 60, type: "Auditorio", status: "operational", hasAC: true, hasProjector: true, hasComputers: false },
  { id: "6", code: "SB-302", name: "Sala de Conferencias B", area: "Edificio SB", floor: 3, capacity: 80, type: "Auditorio", status: "operational", hasAC: true, hasProjector: true, hasComputers: false },
  { id: "7", code: "SB-401", name: "Aula de Postgrado", area: "Edificio SB", floor: 4, capacity: 20, type: "Aula", status: "operational", hasAC: true, hasProjector: true, hasComputers: false },
  { id: "8", code: "SB-402", name: "Laboratorio de Electrónica", area: "Edificio SB", floor: 4, capacity: 20, type: "Laboratorio", status: "operational", hasAC: false, hasProjector: false, hasComputers: false },
];

const typeColors = {
  Aula: { bg: "#EBF5FB", color: "#1A5276", border: "#AED6F1" },
  Laboratorio: { bg: "#EAFAF1", color: "#1E8449", border: "#A9DFBF" },
  Auditorio: { bg: "#FEF9E7", color: "#9A7D0A", border: "#F9E79F" },
};

export default function AdminSpacesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [spaces, setSpaces] = useState(SPACES);
  const [showModal, setShowModal] = useState(false);
  const [editSpace, setEditSpace] = useState(null);

  const types = ["Todos", "Aula", "Laboratorio", "Auditorio"];

  const filtered = spaces.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
    const matchType = typeFilter === "Todos" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  const toggleStatus = (id) => {
    setSpaces(spaces.map((s) =>
      s.id === id
        ? { ...s, status: s.status === "operational" ? "maintenance" : "operational" }
        : s
    ));
  };

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Espacios</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra el inventario de espacios universitarios
          </p>
        </div>
        <button
          onClick={() => { setEditSpace(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
          style={{ background: "#C0392B" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Agregar espacio
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total espacios", value: spaces.length, color: "#1A1A2E" },
          { label: "Aulas", value: spaces.filter((s) => s.type === "Aula").length, color: "#1A5276" },
          { label: "Laboratorios", value: spaces.filter((s) => s.type === "Laboratorio").length, color: "#1E8449" },
          { label: "En mantenimiento", value: spaces.filter((s) => s.status === "maintenance").length, color: "#C0392B" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={typeFilter === t ? { background: "#C0392B", color: "white" } : { color: "#6B7280" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
              {["Espacio", "Código", "Piso", "Tipo", "Capacidad", "Equipamiento", "Estado", "Acciones"].map((h) => (
                <th key={h} className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 ${h === "Acciones" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((space, idx) => {
              const tc = typeColors[space.type] || typeColors.Aula;
              const isOp = space.status === "operational";
              return (
                <tr
                  key={space.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderTop: idx > 0 ? "1px solid #F9FAFB" : "none" }}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900">{space.name}</p>
                    <p className="text-xs text-gray-400">{space.area}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-gray-600">{space.code}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">Piso {space.floor}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}
                    >
                      {space.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{space.capacity} personas</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {space.hasAC && <span title="Aire acondicionado" className="text-sm">❄️</span>}
                      {space.hasProjector && <span title="Proyector" className="text-sm">📽️</span>}
                      {space.hasComputers && <span title="Computadores" className="text-sm">💻</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={isOp ? { background: "#D5F5E3", color: "#1E8449" } : { background: "#FDEDEC", color: "#C0392B" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isOp ? "#1E8449" : "#C0392B" }} />
                      {isOp ? "Operacional" : "Mantenimiento"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditSpace(space); setShowModal(true); }}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleStatus(space.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                        style={isOp ? { borderColor: "#F1948A", color: "#C0392B" } : { borderColor: "#A9DFBF", color: "#1E8449" }}
                      >
                        {isOp ? "Mantenimiento" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400">No se encontraron espacios</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {editSpace ? "Editar espacio" : "Agregar espacio"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                  <input defaultValue={editSpace?.name || ""} placeholder="Nombre del espacio" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Código</label>
                  <input defaultValue={editSpace?.code || ""} placeholder="SB-XXX" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
                    {["Aula", "Laboratorio", "Auditorio"].map((t) => (
                      <option key={t} selected={editSpace?.type === t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacidad</label>
                  <input type="number" defaultValue={editSpace?.capacity || ""} placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipamiento</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "A/C", key: "hasAC" },
                    { label: "Proyector", key: "hasProjector" },
                    { label: "Computadores", key: "hasComputers" },
                  ].map((eq) => (
                    <label key={eq.key} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" defaultChecked={editSpace?.[eq.key]} className="accent-red-600" />
                      <span className="text-xs font-medium text-gray-700">{eq.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                style={{ background: "#C0392B" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
              >
                {editSpace ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
