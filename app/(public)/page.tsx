import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import AnunciosGrid from "@/components/public/AnunciosGrid";
import EventosPreview from "@/components/public/EventosPreview";

export const dynamic = "force-dynamic";

export default async function InicioPage() {
  const now = new Date();
  const anuncios = await prisma.anuncio.findMany({
    where: {
      estado: "publicado",
      fechaPublicacion: { lte: now },
    },
    orderBy: { fechaPublicacion: "desc" },
    take: 6,
  });

  const proximosEventos = await prisma.evento.findMany({
    where: { fecha: { gte: new Date() } },
    orderBy: { fecha: "asc" },
    take: 3,
  });

  return (
    <div>
      {/* Hero con foto real */}
      <section className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        <Image
          src="/images/campo-1.jpg"
          alt="Campo de Golf México"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#0F2419]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F2419]/60" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
          <Image
            src="/images/logo.png"
            alt="Club de Golf México"
            width={80}
            height={80}
            className="object-contain mb-8 opacity-90"
          />
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.35em] mb-6">
            Portal de Colonos
          </p>
          <h1 className="font-serif font-normal text-[#F7F3EC] text-5xl md:text-7xl leading-[1.05] mb-4">
            Residencial<br />
            <em className="text-[#B8922A] not-italic">Club de Golf</em><br />
            México
          </h1>
          <div className="w-14 h-px bg-[#B8922A] mx-auto my-7" />
          <p className="text-[#F7F3EC]/60 text-sm md:text-base max-w-md font-light tracking-wide">
            Arenal Tepepan · Tlalpan · Ciudad de México
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              { href: "/nosotros", label: "Nosotros" },
              { href: "/calendario", label: "Calendario" },
              { href: "/estado-de-cuenta", label: "Estado de Cuenta" },
              { href: "/encuestas", label: "Encuestas" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-6 py-2 border border-[#F7F3EC]/30 text-[#F7F3EC]/70 hover:border-[#B8922A] hover:text-[#B8922A] transition-colors text-xs tracking-widest uppercase rounded-full backdrop-blur-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Avisos */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
            Comunicados
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1A3D2B] font-normal">
            Avisos y Anuncios
          </h2>
          <div className="w-10 h-px bg-[#B8922A] mt-4" />
        </div>

        <AnunciosGrid anuncios={anuncios.map(a => ({
          ...a,
          fechaPublicacion: a.fechaPublicacion ? a.fechaPublicacion.toISOString() : null,
        }))} />
      </section>

      {/* Próximos Eventos */}
      {proximosEventos.length > 0 && (
        <section className="relative overflow-hidden">
          <Image
            src="/images/campo-2.jpg"
            alt="Campo de Golf"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1A3D2B]/88" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
                  Agenda
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#F7F3EC] font-normal">
                  Próximos Eventos
                </h2>
                <div className="w-10 h-px bg-[#B8922A] mt-4" />
              </div>
              <Link
                href="/calendario"
                className="text-[#B8922A] text-xs uppercase tracking-widest hover:text-[#F7F3EC] transition-colors hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>

            <EventosPreview eventos={proximosEventos.map(e => ({
              ...e,
              fecha: e.fecha.toISOString(),
              hora: e.hora ?? null,
              lugar: e.lugar ?? null,
              descripcion: e.descripcion ?? null,
            }))} />
          </div>
        </section>
      )}

      {/* Quick links */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/nosotros", title: "Nosotros", sub: "Mesa directiva · Misión" },
            { href: "/calendario", title: "Calendario", sub: "Torneos · Reuniones" },
            { href: "/estado-de-cuenta", title: "Estado de Cuenta", sub: "Cuotas · Pagos" },
            { href: "/encuestas", title: "Encuestas", sub: "Votaciones activas" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl border border-[#e8e3da] p-6 hover:border-[#B8922A]/40 hover:shadow-md transition-all duration-300"
            >
              <div className="w-5 h-px bg-[#B8922A]/40 mb-4 group-hover:w-8 transition-all duration-300" />
              <p className="font-serif text-[#1A3D2B] text-base mb-1">{item.title}</p>
              <p className="text-[#1A3D2B]/40 text-xs tracking-wide">{item.sub}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
