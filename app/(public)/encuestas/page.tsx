"use client";

import { useEffect, useState } from "react";

interface Opcion {
  id: string;
  texto: string;
  _count: { votos: number };
}

interface Encuesta {
  id: string;
  pregunta: string;
  estado: string;
  opciones: Opcion[];
  _count: { votos: number };
}

export default function EncuestasPage() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [votadas, setVotadas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/encuestas")
      .then((r) => r.json())
      .then(setEncuestas)
      .finally(() => setLoading(false));
    const saved = localStorage.getItem("cgm_votos");
    if (saved) setVotadas(JSON.parse(saved));
  }, []);

  async function votar(encuestaId: string, opcionId: string) {
    const res = await fetch(`/api/encuestas/${encuestaId}/votar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opcionId }),
    });
    if (!res.ok) return;
    const nuevos = { ...votadas, [encuestaId]: opcionId };
    setVotadas(nuevos);
    localStorage.setItem("cgm_votos", JSON.stringify(nuevos));
    const updated = await fetch("/api/encuestas").then((r) => r.json());
    setEncuestas(updated);
  }

  const activas = encuestas.filter((e) => e.estado === "activa");
  const cerradas = encuestas.filter((e) => e.estado === "cerrada");

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
        Cargando encuestas…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📊</span>
        <div>
          <h1 className="text-3xl font-bold text-[#1A3D2B]">Encuestas</h1>
          <p className="text-gray-500 text-sm">Participa en las votaciones de la comunidad</p>
        </div>
      </div>

      {/* Encuestas activas */}
      {activas.length > 0 ? (
        <div className="space-y-6">
          {activas.map((enc) => {
            const yaVoto = votadas[enc.id];
            const total = enc._count.votos || 1;

            return (
              <div
                key={enc.id}
                className="bg-white rounded-2xl border-2 border-[#B8922A] p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#B8922A] inline-block animate-pulse" />
                  <span className="text-[#B8922A] text-xs font-semibold uppercase tracking-wide">
                    Encuesta activa
                  </span>
                </div>
                <p className="font-bold text-[#1A3D2B] text-lg mb-4">{enc.pregunta}</p>

                <div className="space-y-3">
                  {enc.opciones.map((op) => {
                    const pct = Math.round((op._count.votos / total) * 100);
                    return (
                      <div key={op.id}>
                        {yaVoto ? (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span
                                className={`font-medium ${yaVoto === op.id ? "text-[#1A3D2B]" : "text-gray-600"}`}
                              >
                                {op.texto}
                                {yaVoto === op.id && " ✓"}
                              </span>
                              <span className="text-gray-500">{pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#B8922A] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => votar(enc.id, op.id)}
                            className="w-full text-left px-4 py-3 rounded-xl border border-[#d4cfc7] hover:border-[#B8922A] hover:bg-[#B8922A]/5 transition-colors text-sm font-medium text-[#1A3D2B]"
                          >
                            {op.texto}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {yaVoto && (
                  <p className="text-xs text-gray-400 mt-3">
                    {enc._count.votos} voto{enc._count.votos !== 1 ? "s" : ""} totales
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">No hay encuestas activas en este momento.</p>
      )}

      {/* Encuestas cerradas */}
      {cerradas.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#1A3D2B] mb-4">Encuestas cerradas</h2>
          <div className="space-y-3">
            {cerradas.map((enc) => {
              const total = enc._count.votos || 1;
              return (
                <details
                  key={enc.id}
                  className="bg-white rounded-xl border border-[#d4cfc7] shadow-sm"
                >
                  <summary className="px-5 py-3 cursor-pointer flex justify-between items-center text-sm font-medium text-[#1A3D2B]">
                    <span>{enc.pregunta}</span>
                    <span className="text-gray-400 text-xs">{enc._count.votos} votos →</span>
                  </summary>
                  <div className="px-5 pb-4 space-y-2 border-t border-[#d4cfc7]">
                    {enc.opciones.map((op) => {
                      const pct = Math.round((op._count.votos / total) * 100);
                      return (
                        <div key={op.id} className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{op.texto}</span>
                            <span className="text-gray-500">{pct}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2A5C40] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
