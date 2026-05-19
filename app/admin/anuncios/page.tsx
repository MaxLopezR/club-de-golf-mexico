"use client";

import { useEffect, useState } from "react";

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  estado: string;
  fechaPublicacion: string | null;
  createdAt: string;
}

const MAX_TITULO = 100;
const MAX_CONTENIDO = 500;

export default function AdminAnunciosPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [editando, setEditando] = useState<Anuncio | null>(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [estado, setEstado] = useState<"publicado" | "borrador" | "programado">("publicado");
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const data = await fetch("/api/anuncios").then((r) => r.json());
    setAnuncios(data);
  }

  useEffect(() => { load(); }, []);

  function startEdit(a: Anuncio) {
    setEditando(a);
    setTitulo(a.titulo);
    setContenido(a.contenido);
    const esProgramado =
      a.estado === "publicado" &&
      a.fechaPublicacion &&
      new Date(a.fechaPublicacion) > new Date();
    setEstado(esProgramado ? "programado" : (a.estado as "publicado" | "borrador"));
    setFechaPublicacion(
      a.fechaPublicacion
        ? new Date(a.fechaPublicacion).toISOString().slice(0, 16)
        : ""
    );
  }

  function resetForm() {
    setEditando(null);
    setTitulo("");
    setContenido("");
    setEstado("publicado");
    setFechaPublicacion("");
    setMsg("");
  }

  async function save() {
    if (!titulo.trim() || !contenido.trim()) {
      setMsg("Completa título y contenido.");
      return;
    }
    setLoading(true);
    setMsg("");
    const estadoApi = estado === "programado" ? "publicado" : estado;
    const payload = {
      titulo,
      contenido,
      estado: estadoApi,
      fechaPublicacion: estado === "programado" ? fechaPublicacion || undefined : undefined,
    };
    if (editando) {
      await fetch(`/api/anuncios/${editando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMsg("Anuncio actualizado.");
    } else {
      await fetch("/api/anuncios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMsg("Anuncio creado.");
    }
    setLoading(false);
    resetForm();
    load();
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este anuncio?")) return;
    await fetch(`/api/anuncios/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3D2B]">Gestión de Anuncios</h1>
        <p className="text-gray-500 text-sm mt-1">Crea y administra los avisos para los colonos</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm">
        <h2 className="font-semibold text-[#1A3D2B] mb-4">
          {editando ? "Editar Anuncio" : "+ Nuevo Anuncio"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">
              Título <span className="text-gray-400 font-normal">({titulo.length}/{MAX_TITULO})</span>
            </label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value.slice(0, MAX_TITULO))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="Título del anuncio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">
              Contenido <span className="text-gray-400 font-normal">({contenido.length}/{MAX_CONTENIDO})</span>
            </label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value.slice(0, MAX_CONTENIDO))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A] resize-none"
              placeholder="Texto del anuncio…"
            />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as "publicado" | "borrador" | "programado")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              >
                <option value="publicado">Publicado</option>
                <option value="borrador">Borrador</option>
                <option value="programado">Programado</option>
              </select>
            </div>
            {estado === "programado" && (
              <div>
                <label className="block text-sm font-medium text-[#1A3D2B] mb-1">
                  Publicar el día y hora
                </label>
                <input
                  type="datetime-local"
                  value={fechaPublicacion}
                  onChange={(e) => setFechaPublicacion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
                />
              </div>
            )}
          </div>
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={loading}
              className="bg-[#1A3D2B] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5C40] transition-colors disabled:opacity-60"
            >
              {loading ? "Guardando…" : editando ? "Guardar cambios" : "Publicar anuncio"}
            </button>
            {editando && (
              <button
                onClick={resetForm}
                className="px-5 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#d4cfc7] flex justify-between items-center">
          <h2 className="font-semibold text-[#1A3D2B]">Anuncios ({anuncios.length})</h2>
        </div>
        {anuncios.length === 0 ? (
          <p className="px-5 py-6 text-gray-500 italic text-sm">Sin anuncios todavía.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1A3D2B] text-white text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-2.5">Título</th>
                <th className="text-left px-5 py-2.5">Estado</th>
                <th className="text-right px-5 py-2.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4cfc7]">
              {anuncios.map((a) => (
                <tr key={a.id} className="hover:bg-[#F7F3EC]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#1A3D2B]">{a.titulo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.contenido}</p>
                  </td>
                  <td className="px-5 py-3">
                    {(() => {
                      const isProgramado =
                        a.estado === "publicado" &&
                        a.fechaPublicacion &&
                        new Date(a.fechaPublicacion) > new Date();
                      return (
                        <span
                          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                            isProgramado
                              ? "bg-blue-100 text-blue-700"
                              : a.estado === "publicado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isProgramado ? "Programado" : a.estado}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button
                      onClick={() => startEdit(a)}
                      className="text-[#B8922A] hover:underline text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(a.id)}
                      className="text-red-500 hover:underline text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
