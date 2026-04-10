"use client";

import { useState } from "react";

const USERS = [
  { id: "u1", code: "1234567", name: "Juan Carlos Díaz", email: "jcdiaz@ufps.edu.co", role: "Estudiante", active: true, createdAt: "2025-01-15" },
  { id: "u2", code: "7654321", name: "María Fernanda López", email: "mflopez@ufps.edu.co", role: "Docente", active: true, createdAt: "2024-08-01" },
  { id: "u3", code: "2345678", name: "Carlos Andrés Ruiz", email: "caruiz@ufps.edu.co", role: "Estudiante", active: true, createdAt: "2025-01-20" },
  { id: "u4", code: "8765432", name: "Laura Milena Torres", email: "lmtorres@ufps.edu.co", role: "Administrativo", active: true, createdAt: "2024-06-10" },
  { id: "u5", code: "3456789", name: "Andrés Felipe Mora", email: "afmora@ufps.edu.co", role: "Estudiante", active: false, createdAt: "2025-02-01" },
  { id: "u6", code: "9876543", name: "Sandra Patricia Gómez", email: "spgomez@ufps.edu.co", role: "Docente", active: true, createdAt: "2024-09-15" },
];

const roleColors = {
  Estudiante: { bg: "#EBF5FB", color: "#1A5276" },
  Docente: { bg: "#EAFAF1", color: "#1E8449" },
  Administrativo: { bg: "#FEF9E7", color: "#9A7D0A" },
};

function Avatar({ name }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("");
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: "#FDEDEC", color: "#C0392B" }}
    >
      {initials}
    </div>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [users, setUsers] = useState(USERS);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const roles = ["Todos", "Estudiante", "Docente", "Administrativo"];

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.code.includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "Todos" || u.role === roleFilter;
    const matchStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Activo" && u.active) ||
      (statusFilter === "Inactivo" && !u.active);
    return matchSearch && matchRole && matchStatus;
  });

  const toggleActive = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los usuarios registrados en el sistema
          </p>
        </div>
        <button
          onClick={() => { setEditUser(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
          style={{ background: "#C0392B" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total usuarios", value: users.length, color: "#1A1A2E" },
          { label: "Estudiantes", value: users.filter((u) => u.role === "Estudiante").length, color: "#1A5276" },
          { label: "Docentes", value: users.filter((u) => u.role === "Docente").length, color: "#1E8449" },
          { label: "Inactivos", value: users.filter((u) => !u.active).length, color: "#C0392B" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, código o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={roleFilter === r ? { background: "#C0392B", color: "white" } : { color: "#6B7280" }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {["Todos", "Activo", "Inactivo"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={statusFilter === s ? { background: "#C0392B", color: "white" } : { color: "#6B7280" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Usuario
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Código
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Rol
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Estado
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Registro
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, idx) => {
              const rc = roleColors[user.role] || roleColors.Estudiante;
              return (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-gray-50"
                  style={{ borderTop: idx > 0 ? "1px solid #F9FAFB" : "none" }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600">{user.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: rc.bg, color: rc.color }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={
                        user.active
                          ? { background: "#D5F5E3", color: "#1E8449" }
                          : { background: "#F3F4F6", color: "#9CA3AF" }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: user.active ? "#1E8449" : "#9CA3AF" }}
                      />
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{user.createdAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditUser(user); setShowModal(true); }}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleActive(user.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                        style={
                          user.active
                            ? { borderColor: "#F1948A", color: "#C0392B" }
                            : { borderColor: "#A9DFBF", color: "#1E8449" }
                        }
                      >
                        {user.active ? "Desactivar" : "Activar"}
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
            <p className="text-gray-400">No se encontraron usuarios</p>
          </div>
        )}

        <div
          className="px-6 py-3 text-xs text-gray-400 flex items-center justify-between"
          style={{ borderTop: "1px solid #F9FAFB" }}
        >
          <span>Mostrando {filtered.length} de {users.length} usuarios</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Anterior</button>
            <button className="px-3 py-1 rounded-lg border text-white" style={{ background: "#C0392B", borderColor: "#C0392B" }}>1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Modal crear/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {editUser ? "Editar usuario" : "Nuevo usuario"}
            </h3>
            <div className="space-y-4">
              {[
                { label: "Nombres y apellidos", placeholder: editUser?.name || "Nombre completo", type: "text" },
                { label: "Código universitario", placeholder: editUser?.code || "1234567", type: "text" },
                { label: "Correo institucional", placeholder: editUser?.email || "usuario@ufps.edu.co", type: "email" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-white">
                  {["Estudiante", "Docente", "Administrativo"].map((r) => (
                    <option key={r} selected={editUser?.role === r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ background: "#C0392B" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#922B21")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
              >
                {editUser ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
