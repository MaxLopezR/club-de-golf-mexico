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

  return (
    <div>
      {/* Header */}
      <section className="bg-[#0F2419] relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #B8922A 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B8922A]/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.3em] mb-4">
            Participación
          </p>
          <h1 className="font-serif font-normal text-[#F7F3EC] text-4xl md:text-6xl leading-tight">
            Encuestas<br />
            <em className="not-italic text-[#B8922A]">y Votaciones</em>
          </h1>
          <div className="w-12 h-px bg-[#B8922A] mt-6 mb-5" />
          <p className="text-[#F7F3EC]/50 text-sm tracking-widest uppercase">
            Participa en las decisiones de la comunidad
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-[#1A3D2B]/40 text-sm tracking-widest uppercase animate-pulse">
              Cargando…
            </p>
          </div>
        ) : (
          <>
            {/* Encuestas activas */}
            {activas.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
                    Activas
                  </p>
                  <h2 className="font-serif text-3xl text-[#1A3D2B] font-normal">
                    Encuestas Abiertas
                  </h2>
                  <div className="w-10 h-px bg-[#B8922A] mt-4" />
                </div>

                {activas.map((enc) => {
                  const yaVoto = votadas[enc.id];
                  const total = enc._count.votos || 1;

                  return (
                    <div
                      key={enc.id}
                      className="bg-white rounded-2xl border-2 border-[#B8922A]/40 p-8 hover:border-[#B8922A] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8922A] animate-pulse" />
                        <span className="text-[#B8922A] text-xs uppercase tracking-[0.2em]">
                          Encuesta activa
                        </span>
                      </div>
                      <p className="font-serif text-[#1A3D2B] text-xl md:text-2xl leading-snug mb-7">
                        {enc.pregunta}
                      </p>

                      <div className="space-y-3">
                        {enc.opciones.map((op) => {
                          const pct = Math.round((op._count.votos / total) * 100);
                          return (
                            <div key={op.id}>
                              {yaVoto ? (
                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span
                                      className={`text-sm tracking-wide ${
                                        yaVoto === op.id
                                          ? "text-[#1A3D2B] font-medium"
                                          : "text-[#1A3D2B]/50"
                                      }`}
                                    >
                                      {op.texto}
                                      {yaVoto === op.id && (
                                        <span className="ml-2 text-[#B8922A]">✓</span>
                                      )}
                                    </span>
                                    <span className="text-[#1A3D2B]/40 text-sm">
                                      {pct}%
                                    </span>
                                  </div>
                                  <div className="h-1 bg-[#e8e3da] rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-700 ${
                                        yaVoto === op.id ? "bg-[#B8922A]" : "bg-[#1A3D2B]/20"
                                      }`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => votar(enc.id, op.id)}
                                  className="w-full text-left px-5 py-3.5 rounded-xl border border-[#e8e3da] hover:border-[#B8922A] hover:bg-[#B8922A]/5 transition-all duration-200 text-sm text-[#1A3D2B] tracking-wide"
                                >
                                  {op.texto}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {yaVoto && (
                        <p className="text-xs text-[#1A3D2B]/30 mt-5 tracking-wide">
                          {enc._count.votos} voto{enc._count.votos !== 1 ? "s" : ""} totales
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-[#d4cfc7] rounded-2xl">
                <p className="text-[#1A3D2B]/40 text-sm tracking-wide">
                  No hay encuestas activas en este momento
                </p>
              </div>
            )}

            {/* Encuestas cerradas */}
            {cerradas.length > 0 && (
              <div>
                <div className="mb-6">
                  <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
                    Historial
                  </p>
                  <h2 className="font-serif text-3xl text-[#1A3D2B] font-normal">
                    Encuestas Cerradas
                  </h2>
                  <div className="w-10 h-px bg-[#B8922A] mt-4" />
                </div>

                <div className="space-y-3">
                  {cerradas.map((enc) => {
                    const total = enc._count.votos || 1;
                    return (
                      <details
                        key={enc.id}
                        className="bg-white rounded-2xl border border-[#e8e3da] overflow-hidden group"
                      >
                        <summary className="px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-[#F7F3EC] transition-colors">
                          <span className="font-serif text-[#1A3D2B] text-sm leading-snug">
                            {enc.pregunta}
                          </span>
                          <span className="text-[#1A3D2B]/30 text-xs tracking-wide ml-4 flex-shrink-0">
                            {enc._count.votos} votos
                          </span>
                        </summary>
                        <div className="px-6 pb-5 pt-4 border-t border-[#e8e3da] space-y-3">
                          {enc.opciones.map((op) => {
                            const pct = Math.round((op._count.votos / total) * 100);
                            return (
                              <div key={op.id}>
                                <div className="flex justify-between mb-1.5">
                                  <span className="text-sm text-[#1A3D2B]/70 tracking-wide">
                                    {op.texto}
                                  </span>
                                  <span className="text-[#1A3D2B]/40 text-sm">{pct}%</span>
                                </div>
                                <div className="h-1 bg-[#e8e3da] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#1A3D2B]/30 rounded-full"
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
          </>
        )}
      </div>
    </div>
  );
}
