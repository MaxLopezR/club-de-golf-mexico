"use client";

import { useEffect, useState } from "react";

interface Opcion { id: string; texto: string; _count: { votos: number }; }
interface Encuesta {
  id: string;
  pregunta: string;
  estado: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  opciones: Opcion[];
  _count: { votos: number };
  createdAt: string;
}

export default function AdminEncuestasPage() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", ""]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await fetch("/api/encuestas").then((r) => r.json());
    setEncuestas(data);
  }

  useEffect(() => { load(); }, []);

  function updateOpcion(i: number, value: string) {
    const updated = [...opciones];
    updated[i] = value;
    setOpciones(updated);
  }

  function addOpcion() {
    if (opciones.length < 6) setOpciones([...opciones, ""]);
  }

  function removeOpcion(i: number) {
    if (opciones.length > 2) setOpciones(opciones.filter((_, idx) => idx !== i));
  }

  async function crear() {
    const opcionesValidas = opciones.filter((o) => o.trim());
    if (!pregunta.trim() || opcionesValidas.length < 2) {
      setMsg("Escribe la pregunta y al menos 2 opciones.");
      return;
    }
    setLoading(true);
    setMsg("");
    await fetch("/api/encuestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pregunta,
        opciones: opcionesValidas,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
      }),
    });
    setPregunta("");
    setOpciones(["", ""]);
    setFechaInicio("");
    setFechaFin("");
    setMsg("Encuesta creada y activada.");
    setLoading(false);
    load();
  }

  async function cambiarEstado(id: string, estado: string) {
    await fetch(`/api/encuestas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    load();
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar esta encuesta y todos sus votos?")) return;
    await fetch(`/api/encuestas/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3D2B]">Encuestas</h1>
        <p className="text-gray-500 text-sm mt-1">Crea y administra votaciones para los colonos</p>
      </div>

      {/* Crear encuesta */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1A3D2B]">+ Nueva Encuesta</h2>
        <div>
          <label className="block text-sm font-medium text-[#1A3D2B] mb-1">
            Pregunta <span className="text-gray-400 font-normal">({pregunta.length}/200)</span>
          </label>
          <input
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value.slice(0, 200))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            placeholder="¿Cuál es tu pregunta para los colonos?"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#1A3D2B]">Opciones de respuesta</label>
          {opciones.map((op, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={op}
                onChange={(e) => updateOpcion(i, e.target.value.slice(0, 100))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
                placeholder={`Opción ${i + 1}`}
              />
              {opciones.length > 2 && (
                <button onClick={() => removeOpcion(i)} className="text-red-400 hover:text-red-600 text-lg px-1">×</button>
              )}
            </div>
          ))}
          {opciones.length < 6 && (
            <button
              onClick={addOpcion}
              className="text-sm text-[#B8922A] hover:underline"
            >
              + Agregar opción
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Fecha inicio <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Fecha fin <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
          </div>
        </div>
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button
          onClick={crear}
          disabled={loading}
          className="bg-[#1A3D2B] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5C40] transition-colors disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear encuesta"}
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        <h2 className="font-semibold text-[#1A3D2B]">Encuestas ({encuestas.length})</h2>
        {encuestas.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Sin encuestas todavía.</p>
        ) : (
          encuestas.map((enc) => {
            const total = enc._count.votos || 1;
            return (
              <div key={enc.id} className="bg-white rounded-xl border border-[#d4cfc7] p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#1A3D2B]">{enc.pregunta}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{enc._count.votos} votos</p>
                    {(enc.fechaInicio || enc.fechaFin) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {enc.fechaInicio && <>Inicio: {new Date(enc.fechaInicio).toLocaleDateString("es-MX")}</>}
                        {enc.fechaInicio && enc.fechaFin && " · "}
                        {enc.fechaFin && <>Fin: {new Date(enc.fechaFin).toLocaleDateString("es-MX")}</>}
                      </p>
                    )}
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      enc.estado === "activa"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {enc.estado}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {enc.opciones.map((op) => {
                    const pct = Math.round((op._count.votos / total) * 100);
                    return (
                      <div key={op.id}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-gray-700">{op.texto}</span>
                          <span className="text-gray-400">{op._count.votos} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#B8922A] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 pt-1">
                  {enc.estado === "activa" ? (
                    <button
                      onClick={() => cambiarEstado(enc.id, "cerrada")}
                      className="text-xs border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50"
                    >
                      Cerrar encuesta
                    </button>
                  ) : (
                    <button
                      onClick={() => cambiarEstado(enc.id, "activa")}
                      className="text-xs border border-[#B8922A] text-[#B8922A] px-3 py-1 rounded-lg hover:bg-[#B8922A]/10"
                    >
                      Reactivar
                    </button>
                  )}
                  <button
                    onClick={() => eliminar(enc.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
