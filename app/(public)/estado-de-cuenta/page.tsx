import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EstadoCuentaPage() {
  const estado = await prisma.estadoCuenta.findFirst({
    include: { historial: { orderBy: { id: "desc" } } },
  });

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
            Finanzas
          </p>
          <h1 className="font-serif font-normal text-[#F7F3EC] text-4xl md:text-6xl leading-tight">
            Estado<br />
            <em className="not-italic text-[#B8922A]">de Cuenta</em>
          </h1>
          <div className="w-12 h-px bg-[#B8922A] mt-6 mb-5" />
          <p className="text-[#F7F3EC]/50 text-sm tracking-widest uppercase">
            Cuotas mensuales · Instrucciones de pago · Historial
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        {!estado ? (
          <div className="py-20 text-center border border-dashed border-[#d4cfc7] rounded-2xl">
            <p className="text-[#1A3D2B]/40 text-sm tracking-wide">
              Información no disponible
            </p>
          </div>
        ) : (
          <>
            {/* Cuota vigente */}
            <div className="bg-[#1A3D2B] rounded-2xl p-8 md:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <p className="text-[#B8922A] text-xs uppercase tracking-[0.25em] mb-4">
                    Cuota Mensual Vigente
                  </p>
                  <p className="font-serif text-5xl md:text-6xl text-[#F7F3EC] font-normal">
                    ${estado.cuotaMensual.toLocaleString("es-MX")}
                  </p>
                  <p className="text-[#F7F3EC]/40 text-sm mt-3 tracking-wide font-light">
                    Vence el {estado.vencimientoDia} de cada mes
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-block border border-[#B8922A] text-[#B8922A] text-xs uppercase tracking-widest px-5 py-2 rounded-full">
                    Al Corriente
                  </span>
                </div>
              </div>
            </div>

            {/* Datos para transferencia */}
            <div className="bg-white rounded-2xl border border-[#e8e3da] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#e8e3da]">
                <p className="text-[#B8922A] text-xs uppercase tracking-[0.2em]">
                  Datos para Transferencia
                </p>
              </div>
              <div className="divide-y divide-[#e8e3da]">
                {[
                  { label: "Banco", value: estado.banco },
                  { label: "CLABE", value: estado.clabe },
                  { label: "Referencia", value: estado.referencia },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center px-8 py-4">
                    <span className="text-[#1A3D2B]/50 text-sm tracking-wide">
                      {row.label}
                    </span>
                    <span className="font-medium text-[#1A3D2B] text-sm tracking-wide">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial de pagos */}
            <div className="bg-white rounded-2xl border border-[#e8e3da] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#e8e3da]">
                <p className="text-[#B8922A] text-xs uppercase tracking-[0.2em]">
                  Historial de Pagos
                </p>
              </div>
              {estado.historial.length === 0 ? (
                <p className="px-8 py-6 text-[#1A3D2B]/40 text-sm tracking-wide italic">
                  Sin historial disponible
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e8e3da]">
                      <th className="text-left px-8 py-3 text-[10px] uppercase tracking-widest text-[#1A3D2B]/40 font-medium">
                        Mes
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#1A3D2B]/40 font-medium">
                        Monto
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-[#1A3D2B]/40 font-medium">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e3da]">
                    {estado.historial.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F7F3EC] transition-colors">
                        <td className="px-8 py-4 text-[#1A3D2B] text-sm font-medium">
                          {p.mes}
                        </td>
                        <td className="px-4 py-4 text-[#1A3D2B]/70 text-sm">
                          ${p.monto.toLocaleString("es-MX")}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs tracking-wide px-3 py-1 rounded-full border ${
                              p.estado === "pagado"
                                ? "border-[#1A3D2B]/20 text-[#1A3D2B] bg-[#1A3D2B]/5"
                                : "border-[#B8922A]/30 text-[#B8922A] bg-[#B8922A]/5"
                            }`}
                          >
                            {p.estado === "pagado" ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1A3D2B]/50 flex-shrink-0" />
                                Pagado
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B8922A] flex-shrink-0" />
                                Pendiente
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
