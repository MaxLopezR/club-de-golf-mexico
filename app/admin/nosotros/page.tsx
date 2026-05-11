"use client";

import { useEffect, useState } from "react";

interface DirectivaMember { cargo: string; nombre: string; }

const MAX_MISION = 600;
const MAX_HISTORIA = 800;

export default function AdminNosotrosPage() {
  const [mision, setMision] = useState("");
  const [historia, setHistoria] = useState("");
  const [directiva, setDirectiva] = useState<DirectivaMember[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/nosotros")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setMision(data.mision || "");
          setHistoria(data.historia || "");
          setDirectiva(JSON.parse(data.directiva || "[]"));
        }
      });
  }, []);

  function addMember() {
    setDirectiva([...directiva, { cargo: "", nombre: "" }]);
  }

  function updateMember(i: number, field: keyof DirectivaMember, value: string) {
    const updated = [...directiva];
    updated[i] = { ...updated[i], [field]: value };
    setDirectiva(updated);
  }

  function removeMember(i: number) {
    setDirectiva(directiva.filter((_, idx) => idx !== i));
  }

  async function save() {
    setLoading(true);
    setMsg("");
    await fetch("/api/nosotros", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mision, historia, directiva }),
    });
    setMsg("Información guardada correctamente.");
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3D2B]">Nosotros</h1>
        <p className="text-gray-500 text-sm mt-1">Edita la directiva, misión e historia del residencial</p>
      </div>

      {/* Directiva */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1A3D2B]">Mesa Directiva</h2>
          <button
            onClick={addMember}
            className="text-sm text-[#B8922A] border border-[#B8922A] px-3 py-1 rounded-lg hover:bg-[#B8922A]/10 transition-colors"
          >
            + Agregar
          </button>
        </div>
        {directiva.map((m, i) => (
          <div key={i} className="flex gap-3 items-start">
            <input
              value={m.cargo}
              onChange={(e) => updateMember(i, "cargo", e.target.value)}
              placeholder="Cargo (ej. Presidente)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
            <input
              value={m.nombre}
              onChange={(e) => updateMember(i, "nombre", e.target.value)}
              placeholder="Nombre completo"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
            <button
              onClick={() => removeMember(i)}
              className="text-red-400 hover:text-red-600 text-lg px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Misión */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-3">
        <label className="block font-semibold text-[#1A3D2B]">
          Misión <span className="text-gray-400 font-normal text-sm">({mision.length}/{MAX_MISION})</span>
        </label>
        <textarea
          value={mision}
          onChange={(e) => setMision(e.target.value.slice(0, MAX_MISION))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A] resize-none"
        />
      </div>

      {/* Historia */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-3">
        <label className="block font-semibold text-[#1A3D2B]">
          Historia <span className="text-gray-400 font-normal text-sm">({historia.length}/{MAX_HISTORIA})</span>
        </label>
        <textarea
          value={historia}
          onChange={(e) => setHistoria(e.target.value.slice(0, MAX_HISTORIA))}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A] resize-none"
        />
      </div>

      {msg && <p className="text-sm text-green-600 font-medium">{msg}</p>}
      <button
        onClick={save}
        disabled={loading}
        className="bg-[#1A3D2B] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2A5C40] transition-colors disabled:opacity-60"
      >
        {loading ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
