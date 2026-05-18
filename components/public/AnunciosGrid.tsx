"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  fechaPublicacion: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AnunciosGrid({ anuncios }: { anuncios: Anuncio[] }) {
  const [selected, setSelected] = useState<Anuncio | null>(null);

  if (anuncios.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-[#d4cfc7] rounded-2xl">
        <p className="text-[#1A3D2B]/40 text-sm tracking-wide">
          Sin anuncios publicados por el momento
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {anuncios.map((a) => (
          <article
            key={a.id}
            onClick={() => setSelected(a)}
            className="bg-white rounded-2xl border border-[#e8e3da] p-6 cursor-pointer hover:border-[#B8922A]/40 hover:shadow-lg transition-all duration-300 group"
          >
            <p className="text-[#B8922A] text-xs uppercase tracking-widest mb-3">
              {a.fechaPublicacion ? formatDate(a.fechaPublicacion) : ""}
            </p>
            <div className="w-6 h-px bg-[#B8922A]/40 mb-3 group-hover:w-10 transition-all duration-300" />
            <h3 className="font-serif text-lg text-[#1A3D2B] leading-snug mb-3">
              {a.titulo}
            </h3>
            <p className="text-sm text-[#1A3D2B]/60 leading-relaxed line-clamp-3">
              {a.contenido}
            </p>
            <p className="text-[#B8922A] text-xs mt-3 tracking-wide">Leer más →</p>
          </article>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-7">
            <div className="flex items-start justify-between mb-4">
              <p className="text-[#B8922A] text-xs uppercase tracking-widest">
                {selected.fechaPublicacion ? formatDate(selected.fechaPublicacion) : "Comunicado"}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="text-[#1A3D2B]/30 hover:text-[#1A3D2B] transition-colors text-lg leading-none ml-4"
              >
                ✕
              </button>
            </div>
            <div className="w-8 h-px bg-[#B8922A] mb-5" />
            <h2 className="font-serif text-2xl text-[#1A3D2B] leading-tight mb-5">
              {selected.titulo}
            </h2>
            <p className="text-[#1A3D2B]/70 leading-relaxed text-sm whitespace-pre-wrap">
              {selected.contenido}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
