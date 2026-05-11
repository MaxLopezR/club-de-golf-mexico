"use client";

import { useEffect, useState } from "react";

interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  descripcion: string | null;
}

export default function AdminCalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await fetch("/api/eventos").then((r) => r.json());
    setEventos(data);
  }

  useEffect(() => { load(); }, []);

  async function agregar() {
    if (!titulo.trim() || !fecha) {
      setMsg("Título y fecha son requeridos.");
      return;
    }
    setLoading(true);
    setMsg("");
    await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, fecha, hora, lugar, descripcion }),
    });
    setTitulo(""); setFecha(""); setHora(""); setLugar(""); setDescripcion("");
    setMsg("Evento agregado.");
    setLoading(false);
    load();
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3D2B]">Calendario de Eventos</h1>
        <p className="text-gray-500 text-sm mt-1">Agrega y elimina eventos del residencial</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1A3D2B]">+ Nuevo Evento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Título del evento *</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value.slice(0, 100))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="Ej. Reunión ordinaria de colonos"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Hora</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Lugar</label>
            <input
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="Ej. Salón de Usos Múltiples"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">
              Descripción <span className="text-gray-400 font-normal">({descripcion.length}/300)</span>
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value.slice(0, 300))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A] resize-none"
            />
          </div>
        </div>
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button
          onClick={agregar}
          disabled={loading}
          className="bg-[#1A3D2B] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5C40] transition-colors disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Agregar evento"}
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[#1A3D2B]">Todos los eventos ({eventos.length})</h2>
        {eventos.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Sin eventos registrados.</p>
        ) : (
          eventos.map((e) => {
            const fecha = new Date(e.fecha);
            return (
              <div key={e.id} className="bg-white rounded-xl border border-[#d4cfc7] p-4 flex gap-4 items-start shadow-sm">
                <div className="flex-shrink-0 bg-[#1A3D2B] text-white rounded-lg px-3 py-2 text-center min-w-[52px]">
                  <p className="text-xs uppercase">{fecha.toLocaleDateString("es-MX", { month: "short" })}</p>
                  <p className="text-xl font-bold leading-none">{fecha.getDate()}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1A3D2B]">{e.titulo}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                    {e.hora && <span>🕐 {e.hora}</span>}
                    {e.lugar && <span>📍 {e.lugar}</span>}
                  </div>
                </div>
                <button
                  onClick={() => eliminar(e.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Eliminar
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
