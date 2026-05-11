import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EstadoCuentaPage() {
  const estado = await prisma.estadoCuenta.findFirst({
    include: { historial: { orderBy: { id: "desc" } } },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧾</span>
        <div>
          <h1 className="text-3xl font-bold text-[#1A3D2B]">Estado de Cuenta</h1>
          <p className="text-gray-500 text-sm">Cuotas mensuales, historial e instrucciones de pago</p>
        </div>
      </div>

      {!estado ? (
        <p className="text-gray-500 italic">Información no disponible.</p>
      ) : (
        <>
          {/* Cuota vigente */}
          <div className="bg-[#1A3D2B] text-white rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Cuota Mensual Vigente</p>
              <p className="text-4xl font-bold">
                ${estado.cuotaMensual.toLocaleString("es-MX")}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Vence el {estado.vencimientoDia} de cada mes
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#B8922A] text-white text-xs font-semibold px-3 py-1 rounded-full">
                AL CORRIENTE
              </span>
            </div>
          </div>

          {/* Datos para transferencia */}
          <div className="bg-white rounded-xl border border-[#d4cfc7] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#d4cfc7]">
              <h2 className="font-semibold text-[#1A3D2B]">Datos para Transferencia</h2>
            </div>
            <div className="divide-y divide-[#d4cfc7]">
              {[
                { label: "Banco", value: estado.banco },
                { label: "CLABE", value: estado.clabe },
                { label: "Referencia", value: estado.referencia },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center px-5 py-3">
                  <span className="text-gray-500 text-sm">{row.label}</span>
                  <span className="font-medium text-[#1A3D2B] text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de pagos */}
          <div className="bg-white rounded-xl border border-[#d4cfc7] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#d4cfc7]">
              <h2 className="font-semibold text-[#1A3D2B]">Historial de Pagos</h2>
            </div>
            {estado.historial.length === 0 ? (
              <p className="px-5 py-4 text-gray-500 italic text-sm">Sin historial disponible.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1A3D2B] text-white text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-2.5">Mes</th>
                    <th className="text-left px-5 py-2.5">Monto</th>
                    <th className="text-left px-5 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4cfc7]">
                  {estado.historial.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F7F3EC]">
                      <td className="px-5 py-3 font-medium text-[#1A3D2B]">{p.mes}</td>
                      <td className="px-5 py-3">${p.monto.toLocaleString("es-MX")}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            p.estado === "pagado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {p.estado === "pagado" ? "✓" : "⏳"} {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
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
  );
}
