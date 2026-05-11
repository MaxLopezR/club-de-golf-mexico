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
      <section className="bg-[#1A3D2B] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#B8922A]/20 border border-[#B8922A]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#B8922A] text-sm font-medium">Portal de Colonos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Residencial<br />
            <span className="text-[#B8922A]">Club de Golf México</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Tu punto de acceso a la información del residencial. Avisos, eventos, cuotas y más.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { href: "/nosotros", label: "Nosotros" },
              { href: "/calendario", label: "Calendario" },
              { href: "/estado-de-cuenta", label: "Estado de Cuenta" },
              { href: "/encuestas", label: "Encuestas" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2 rounded-full border border-white/30 text-white/80 hover:border-[#B8922A] hover:text-[#B8922A] transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Avisos y Anuncios */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#1A3D2B] text-xl">📢</span>
            <h2 className="text-2xl font-bold text-[#1A3D2B]">Avisos y Anuncios</h2>
          </div>
          {anuncios.length === 0 ? (
            <p className="text-gray-500 italic">Sin anuncios publicados por el momento.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {anuncios.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-[#d4cfc7] p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-[#B8922A] text-xs font-medium mb-2">
                    {a.fechaPublicacion ? formatDate(a.fechaPublicacion) : ""}
                  </p>
                  <h3 className="font-semibold text-[#1A3D2B] mb-2 leading-snug">{a.titulo}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{a.contenido}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Próximos Eventos */}
        {proximosEventos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[#1A3D2B] text-xl">📅</span>
                <h2 className="text-2xl font-bold text-[#1A3D2B]">Próximos Eventos</h2>
              </div>
              <Link href="/calendario" className="text-[#B8922A] text-sm hover:underline font-medium">
                Ver todos →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {proximosEventos.map((e) => {
                const fecha = new Date(e.fecha);
                return (
                  <div key={e.id} className="bg-white rounded-xl border border-[#d4cfc7] p-4 flex gap-4 shadow-sm">
                    <div className="flex-shrink-0 bg-[#1A3D2B] text-white rounded-lg w-12 h-12 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-medium uppercase leading-none">
                        {fecha.toLocaleDateString("es-MX", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold leading-none">{fecha.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A3D2B] text-sm leading-snug">{e.titulo}</p>
                      {e.hora && <p className="text-xs text-gray-500 mt-0.5">{e.hora} hrs</p>}
                      {e.lugar && <p className="text-xs text-gray-500">{e.lugar}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
