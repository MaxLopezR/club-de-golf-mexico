import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];
const DIAS = ["L","M","M","J","V","S","D"];

function buildCalendarDays(year: number, month: number, eventDays: Set<number>) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // lunes primero
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
  const cells = buildCalendarDays(year, month, eventDays);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📅</span>
        <div>
          <h1 className="text-3xl font-bold text-[#1A3D2B]">Calendario de Eventos</h1>
          <p className="text-gray-500 text-sm">Torneos, reuniones, actividades y mantenimientos</p>
        </div>
      </div>

      {/* Calendario visual */}
      <div className="bg-white rounded-2xl border border-[#d4cfc7] shadow-sm overflow-hidden">
        <div className="bg-[#1A3D2B] text-white text-center py-3 font-semibold text-lg">
          {MESES[month]} {year}
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 border-b border-[#d4cfc7]">
          {DIAS.map((d, i) => (
            <div key={i} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center">
          {cells.map((day, i) => {
            const hasEvent = day !== null && eventDays.has(day);
            const isToday = day === now.getDate();
            return (
              <div
                key={i}
                className={`py-3 text-sm relative ${
                  day === null ? "" :
                  hasEvent
                    ? "bg-[#1A3D2B] text-[#B8922A] font-bold"
                    : isToday
                    ? "text-[#B8922A] font-semibold"
                    : "text-gray-700"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de próximos eventos */}
      <div>
        <h2 className="text-xl font-bold text-[#1A3D2B] mb-4">Próximas actividades</h2>
        {proximosEventos.length === 0 ? (
          <p className="text-gray-500 italic">No hay eventos próximos registrados.</p>
        ) : (
          <div className="space-y-3">
            {proximosEventos.map((e) => {
              const fecha = new Date(e.fecha);
              return (
                <div
                  key={e.id}
                  className="bg-white rounded-xl border border-[#d4cfc7] p-4 flex gap-4 items-start shadow-sm"
                >
                  <div className="flex-shrink-0 bg-[#1A3D2B] text-white rounded-lg px-3 py-2 text-center min-w-[52px]">
                    <p className="text-xs uppercase leading-none">
                      {fecha.toLocaleDateString("es-MX", { month: "short" })}
                    </p>
                    <p className="text-xl font-bold leading-none mt-0.5">{fecha.getDate()}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A3D2B]">{e.titulo}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      {e.hora && <span className="text-xs text-gray-500">🕐 {e.hora} hrs</span>}
                      {e.lugar && <span className="text-xs text-gray-500">📍 {e.lugar}</span>}
                    </div>
                    {e.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{e.descripcion}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
