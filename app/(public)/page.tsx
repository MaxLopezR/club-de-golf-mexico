import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InicioPage() {
  const anuncios = await prisma.anuncio.findMany({
    where: { estado: "publicado" },
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
      {/* Hero */}
      <section className="bg-[#0F2419] relative overflow-hidden py-28 md:py-40">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #B8922A 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B8922A]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B8922A]/30 to-transparent" />

        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.3em] mb-8">
            Portal de Colonos
          </p>
          <h1 className="font-serif font-normal text-[#F7F3EC] text-5xl md:text-7xl leading-[1.05] mb-6">
            Residencial<br />
            <em className="text-[#B8922A] not-italic">Club de Golf</em><br />
            México
          </h1>
          <div className="w-14 h-px bg-[#B8922A] mx-auto my-8" />
          <p className="text-[#F7F3EC]/50 text-base md:text-lg max-w-md mx-auto font-light tracking-wide">
            Arenal Tepepan · Tlalpan · Ciudad de México
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {[
              { href: "/nosotros", label: "Nosotros" },
              { href: "/calendario", label: "Calendario" },
              { href: "/estado-de-cuenta", label: "Estado de Cuenta" },
              { href: "/encuestas", label: "Encuestas" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-6 py-2 border border-[#B8922A]/40 text-[#F7F3EC]/60 hover:border-[#B8922A] hover:text-[#B8922A] transition-colors text-xs tracking-widest uppercase rounded-full"
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

        {anuncios.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#d4cfc7] rounded-2xl">
            <p className="text-[#1A3D2B]/40 text-sm tracking-wide">
              Sin anuncios publicados por el momento
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {anuncios.map((a) => (
              <article
                key={a.id}
                className="bg-white rounded-2xl border border-[#e8e3da] p-6 hover:border-[#B8922A]/40 hover:shadow-lg transition-all duration-300 group"
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
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Próximos Eventos */}
      {proximosEventos.length > 0 && (
        <section className="bg-[#1A3D2B]">
          <div className="max-w-6xl mx-auto px-6 py-20">
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

            <div className="grid gap-4 md:grid-cols-3">
              {proximosEventos.map((e) => {
                const fecha = new Date(e.fecha);
                return (
                  <div
                    key={e.id}
                    className="border border-white/10 rounded-2xl p-6 hover:border-[#B8922A]/40 transition-colors"
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
                        <p className="font-serif text-[#F7F3EC] text-base leading-snug">
                          {e.titulo}
                        </p>
                        {e.hora && (
                          <p className="text-[#F7F3EC]/40 text-xs mt-2 tracking-wide">
                            {e.hora} hrs
                          </p>
                        )}
                        {e.lugar && (
                          <p className="text-[#F7F3EC]/40 text-xs tracking-wide">
                            {e.lugar}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 sm:hidden text-center">
              <Link
                href="/calendario"
                className="text-[#B8922A] text-xs uppercase tracking-widest"
              >
                Ver todos los eventos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick links strip */}
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
