"use client";
import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  descripcion: string | null;
}

export default function EventosPreview({ eventos }: { eventos: Evento[] }) {
  const [selected, setSelected] = useState<Evento | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {eventos.map((e) => {
          const fecha = new Date(e.fecha);
          return (
            <div
              key={e.id}
              onClick={() => setSelected(e)}
              className="border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-[#B8922A]/40 transition-colors backdrop-blur-sm"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 text-center min-w-[48px]">
                  <p className="text-[#B8922A] text-xs uppercase tracking-widest leading-none">
                    {fecha.toLocaleDateString("es-MX", { month: "short" })}
                  </p>
                  <p className="font-serif text-4xl text-[#F7F3EC] font-normal leading-tight mt-0.5">
                    {fecha.getDate()}
                  </p>
                </div>
                <div className="border-l border-white/10 pl-5 flex-1">
                  <p className="font-serif text-[#F7F3EC] text-base leading-snug">{e.titulo}</p>
                  {e.hora && (
                    <p className="text-[#F7F3EC]/40 text-xs mt-2 tracking-wide">{e.hora} hrs</p>
                  )}
                  {e.lugar && (
                    <p className="text-[#F7F3EC]/40 text-xs tracking-wide">{e.lugar}</p>
                  )}
                  {e.descripcion && (
                    <p className="text-[#B8922A] text-xs mt-2 tracking-wide">Ver detalle →</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:hidden text-center">
        <Link href="/calendario" className="text-[#B8922A] text-xs uppercase tracking-widest">
          Ver todos los eventos →
        </Link>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (() => {
          const fecha = new Date(selected.fecha);
          return (
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[#B8922A] text-xs uppercase tracking-widest">
                  {fecha.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[#1A3D2B]/30 hover:text-[#1A3D2B] transition-colors text-lg leading-none ml-4"
                >
                  ✕
                </button>
              </div>
              <div className="w-8 h-px bg-[#B8922A] mb-5" />
              <h2 className="font-serif text-2xl text-[#1A3D2B] leading-tight mb-4">
                {selected.titulo}
              </h2>
              <div className="space-y-1.5 mb-5">
                {selected.hora && (
                  <p className="text-sm text-[#1A3D2B]/60 tracking-wide">
                    <span className="text-[#1A3D2B]/40 text-xs uppercase tracking-widest mr-2">Hora</span>
                    {selected.hora} hrs
                  </p>
                )}
                {selected.lugar && (
                  <p className="text-sm text-[#1A3D2B]/60 tracking-wide">
                    <span className="text-[#1A3D2B]/40 text-xs uppercase tracking-widest mr-2">Lugar</span>
                    {selected.lugar}
                  </p>
                )}
              </div>
              {selected.descripcion && (
                <p className="text-[#1A3D2B]/70 leading-relaxed text-sm">
                  {selected.descripcion}
                </p>
              )}
            </div>
          );
        })()}
      </Modal>
    </>
  );
}
