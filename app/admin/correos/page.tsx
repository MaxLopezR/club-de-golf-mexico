"use client";

import { useEffect, useState } from "react";

interface Colono { id: string; email: string; nombre: string | null; }

export default function AdminCorreosPage() {
  const [colonos, setColonos] = useState<Colono[]>([]);
  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"enviar" | "lista">("enviar");

  async function loadColonos() {
    const data = await fetch("/api/colonos").then((r) => r.json());
    if (Array.isArray(data)) setColonos(data);
  }

  useEffect(() => { loadColonos(); }, []);

  async function enviarCorreo() {
    if (!asunto.trim() || !cuerpo.trim()) {
      setMsg({ text: "Escribe el asunto y el mensaje.", type: "error" });
      return;
    }
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/correos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asunto, cuerpo }),
    });
    setLoading(false);
    const data = await res.json();
    if (res.ok) {
      setMsg({ text: `Correo enviado a ${data.enviados} colonos${data.simulated ? " (simulado — configura RESEND_API_KEY)" : ""}.`, type: "ok" });
      setAsunto("");
      setCuerpo("");
    } else {
      setMsg({ text: data.error || "Error al enviar", type: "error" });
    }
  }

  async function agregarColono() {
    if (!nuevoEmail.trim()) return;
    const res = await fetch("/api/colonos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nuevoEmail.trim(), nombre: nuevoNombre.trim() || null }),
    });
    if (res.ok) {
      setNuevoEmail("");
      setNuevoNombre("");
      loadColonos();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3D2B]">Correos Masivos</h1>
        <p className="text-gray-500 text-sm mt-1">Envía comunicados a todos los colonos registrados</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#d4cfc7]">
        {(["enviar", "lista"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-[#B8922A] text-[#B8922A]"
                : "border-transparent text-gray-500 hover:text-[#1A3D2B]"
            }`}
          >
            {t === "enviar" ? "✉️ Enviar correo" : `👥 Lista de colonos (${colonos.length})`}
          </button>
        ))}
      </div>

      {tab === "enviar" && (
        <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-4">
          <p className="text-sm text-gray-500">
            Se enviará a <strong className="text-[#1A3D2B]">{colonos.length} colonos</strong> registrados y activos.
          </p>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Asunto</label>
            <input
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="Ej. Reunión ordinaria — Junio 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Mensaje</label>
            <textarea
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A] resize-none"
              placeholder="Escribe aquí el contenido del correo…"
            />
          </div>
          {msg && (
            <p className={`text-sm p-3 rounded-lg ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {msg.text}
            </p>
          )}
          <button
            onClick={enviarCorreo}
            disabled={loading || colonos.length === 0}
            className="bg-[#1A3D2B] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2A5C40] transition-colors disabled:opacity-60"
          >
            {loading ? "Enviando…" : `Enviar a ${colonos.length} colonos`}
          </button>
        </div>
      )}

      {tab === "lista" && (
        <div className="space-y-6">
          {/* Agregar colono */}
          <div className="bg-white rounded-xl border border-[#d4cfc7] p-5 shadow-sm space-y-3">
            <h2 className="font-semibold text-[#1A3D2B] text-sm">+ Agregar colono</h2>
            <div className="flex gap-3 flex-wrap">
              <input
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
                type="email"
                placeholder="correo@ejemplo.com"
                className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              />
              <input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre (opcional)"
                className="flex-1 min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              />
              <button
                onClick={agregarColono}
                className="bg-[#1A3D2B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5C40] transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="bg-white rounded-xl border border-[#d4cfc7] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#d4cfc7]">
              <p className="font-semibold text-[#1A3D2B] text-sm">{colonos.length} colonos registrados</p>
            </div>
            {colonos.length === 0 ? (
              <p className="px-5 py-6 text-gray-400 italic text-sm">Sin colonos. Agrega correos arriba.</p>
            ) : (
              <div className="divide-y divide-[#d4cfc7] max-h-96 overflow-y-auto">
                {colonos.map((c) => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1A3D2B]">{c.nombre || "—"}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
