import { prisma } from "@/lib/db";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface DirectivaMember {
  cargo: string;
  nombre: string;
}

export default async function NosotrosPage() {
  const info = await prisma.infoNosotros.findFirst();
  const directiva: DirectivaMember[] = info ? JSON.parse(info.directiva) : [];

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src="/images/campo-2.jpg"
          alt="Club de Golf México"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#0F2419]/80" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.3em] mb-4">
            Comunidad
          </p>
          <h1 className="font-serif font-normal text-[#F7F3EC] text-4xl md:text-6xl leading-tight">
            Residencial<br />
            <em className="not-italic text-[#B8922A]">Club de Golf México</em>
          </h1>
          <div className="w-12 h-px bg-[#B8922A] mt-6 mb-5" />
          <p className="text-[#F7F3EC]/50 text-sm tracking-widest uppercase">
            Arenal Tepepan · Tlalpan · CDMX
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Mesa Directiva */}
        <section>
          <div className="mb-10">
            <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
              Gobierno
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A3D2B] font-normal">
              Mesa Directiva
            </h2>
            <div className="w-10 h-px bg-[#B8922A] mt-4" />
          </div>

          {directiva.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#d4cfc7] rounded-2xl">
              <p className="text-[#1A3D2B]/40 text-sm tracking-wide">
                Información de directiva no disponible
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {directiva.map((member, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#e8e3da] p-8 text-center hover:border-[#B8922A]/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1A3D2B] flex items-center justify-center mx-auto mb-5">
                    <span className="font-serif text-[#B8922A] text-lg font-medium">
                      {member.nombre.split(" ").pop()?.charAt(0) || "—"}
                    </span>
                  </div>
                  <p className="text-[#B8922A] text-xs uppercase tracking-[0.2em] mb-2">
                    {member.cargo}
                  </p>
                  <p className="font-serif text-[#1A3D2B] text-lg">{member.nombre}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Misión & Historia */}
        {info && (
          <section>
            <div className="mb-10">
              <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
                Identidad
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A3D2B] font-normal">
                Misión &amp; Historia
              </h2>
              <div className="w-10 h-px bg-[#B8922A] mt-4" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-[#1A3D2B] rounded-2xl p-8">
                <p className="text-[#B8922A] text-xs uppercase tracking-[0.2em] mb-4">
                  Nuestra Misión
                </p>
                <p className="text-[#F7F3EC]/80 leading-relaxed font-light">
                  {info.mision}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#e8e3da] p-8">
                <p className="text-[#B8922A] text-xs uppercase tracking-[0.2em] mb-4">
                  Historia
                </p>
                <p className="text-[#1A3D2B]/70 leading-relaxed font-light">
                  {info.historia}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
