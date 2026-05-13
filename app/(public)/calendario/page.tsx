import { prisma } from "@/lib/db";
import Image from "next/image";

export const dynamic = "force-dynamic";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DIAS = ["L","M","M","J","V","S","D"];

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default async function CalendarioPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const eventosDelMes = await prisma.evento.findMany({
    where: { fecha: { gte: startOfMonth, lte: endOfMonth } },
    orderBy: { fecha: "asc" },
  });

  const proximosEventos = await prisma.evento.findMany({
    where: { fecha: { gte: new Date() } },
    orderBy: { fecha: "asc" },
    take: 10,
  });

  const eventDays = new Set(eventosDelMes.map((e) => new Date(e.fecha).getDate()));
  const cells = buildCalendarDays(year, month);

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src="/images/campo-1.jpg"
          alt="Campo de Golf México"
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-[#0F2419]/80" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.3em] mb-4">
            Agenda
          </p>
          <h1 className="font-serif font-normal text-[#F7F3EC] text-4xl md:text-6xl leading-tight">
            Calendario<br />
            <em className="not-italic text-[#B8922A]">de Eventos</em>
          </h1>
          <div className="w-12 h-px bg-[#B8922A] mt-6 mb-5" />
          <p className="text-[#F7F3EC]/50 text-sm tracking-widest uppercase">
            Torneos · Reuniones · Actividades
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Calendario visual */}
        <section>
          <div className="mb-8">
            <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
              {year}
            </p>
            <h2 className="font-serif text-3xl text-[#1A3D2B] font-normal">
              {MESES[month]}
            </h2>
            <div className="w-10 h-px bg-[#B8922A] mt-4" />
          </div>

          <div className="bg-white rounded-2xl border border-[#e8e3da] overflow-hidden">
            <div className="grid grid-cols-7 text-center border-b border-[#e8e3da]">
              {DIAS.map((d, i) => (
                <div
                  key={i}
                  className="py-3 text-[10px] uppercase tracking-widest text-[#1A3D2B]/40 font-medium"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center">
              {cells.map((day, i) => {
                const hasEvent = day !== null && eventDays.has(day);
                const isToday = day === now.getDate();
                return (
                  <div
                    key={i}
                    className={`py-3.5 text-sm relative ${
                      day === null
                        ? ""
                        : hasEvent
                        ? "font-semibold"
                        : isToday
                        ? "font-semibold"
                        : "text-[#1A3D2B]/60"
                    }`}
                  >
                    {hasEvent && day !== null ? (
                      <span className="relative">
                        <span className="relative z-10 text-white text-xs">{day}</span>
                        <span className="absolute inset-0 -m-1 bg-[#1A3D2B] rounded-full" />
                      </span>
                    ) : isToday && day !== null ? (
                      <span className="relative">
                        <span className="relative z-10 text-[#B8922A]">{day}</span>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B8922A] rounded-full" />
                      </span>
                    ) : (
                      day
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {eventDays.size > 0 && (
            <p className="mt-3 text-xs text-[#1A3D2B]/40 tracking-wide">
              Los días marcados tienen eventos programados
            </p>
          )}
        </section>

        {/* Próximas actividades */}
        <section>
          <div className="mb-8">
            <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-3">
              Próximas fechas
            </p>
            <h2 className="font-serif text-3xl text-[#1A3D2B] font-normal">
              Actividades
            </h2>
            <div className="w-10 h-px bg-[#B8922A] mt-4" />
          </div>

          {proximosEventos.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#d4cfc7] rounded-2xl">
              <p className="text-[#1A3D2B]/40 text-sm tracking-wide">
                No hay eventos próximos registrados
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {proximosEventos.map((e) => {
                const fecha = new Date(e.fecha);
                return (
                  <div
                    key={e.id}
                    className="bg-white rounded-2xl border border-[#e8e3da] p-5 flex gap-5 items-start hover:border-[#B8922A]/40 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex-shrink-0 text-center min-w-[56px]">
                      <p className="text-[#B8922A] text-[10px] uppercase tracking-widest leading-none">
                        {fecha.toLocaleDateString("es-MX", { month: "short" })}
                      </p>
                      <p className="font-serif text-3xl text-[#1A3D2B] font-normal leading-tight mt-0.5">
                        {fecha.getDate()}
                      </p>
                    </div>
                    <div className="border-l border-[#e8e3da] pl-5 flex-1">
                      <p className="font-serif text-[#1A3D2B] text-base leading-snug">
                        {e.titulo}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                        {e.hora && (
                          <span className="text-xs text-[#1A3D2B]/40 tracking-wide">
                            {e.hora} hrs
                          </span>
                        )}
                        {e.lugar && (
                          <span className="text-xs text-[#1A3D2B]/40 tracking-wide">
                            {e.lugar}
                          </span>
                        )}
                      </div>
                      {e.descripcion && (
                        <p className="text-sm text-[#1A3D2B]/60 mt-2 leading-relaxed font-light">
                          {e.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
