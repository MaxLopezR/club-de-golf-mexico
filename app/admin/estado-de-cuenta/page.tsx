"use client";

import { useEffect, useState } from "react";

interface PagoHistorial { mes: string; monto: number; estado: "pagado" | "pendiente"; }
interface EstadoCuenta {
  cuotaMensual: number;
  banco: string;
  clabe: string;
  referencia: string;
  vencimientoDia: number;
  historial: PagoHistorial[];
}

export default function AdminEstadoCuentaPage() {
  const [data, setData] = useState<EstadoCuenta>({
    cuotaMensual: 0, banco: "", clabe: "", referencia: "", vencimientoDia: 15, historial: [],
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/estado-cuenta")
      .then((r) => r.json())
      .then((d) => { if (d) setData({ ...d, historial: d.historial || [] }); });
  }, []);

  function updateHistorial(i: number, field: keyof PagoHistorial, value: string) {
    const updated = [...data.historial];
    updated[i] = { ...updated[i], [field]: field === "monto" ? parseFloat(value) || 0 : value } as PagoHistorial;
    setData({ ...data, historial: updated });
  }

  function addPago() {
    setData({ ...data, historial: [{ mes: "", monto: data.cuotaMensual, estado: "pagado" }, ...data.historial] });
  }

  function removePago(i: number) {
    setData({ ...data, historial: data.historial.filter((_, idx) => idx !== i) });
  }

  async function save() {
    setLoading(true);
    setMsg("");
    await fetch("/api/estado-cuenta", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMsg("Estado de cuenta guardado.");
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3D2B]">Estado de Cuenta</h1>
        <p className="text-gray-500 text-sm mt-1">Edita la cuota, datos bancarios e historial de pagos</p>
      </div>

      {/* Cuota y datos */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-[#1A3D2B]">Cuota y Datos de Pago</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Cuota mensual ($)</label>
            <input
              type="number"
              value={data.cuotaMensual}
              onChange={(e) => setData({ ...data, cuotaMensual: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Día de vencimiento</label>
            <input
              type="number"
              min={1} max={31}
              value={data.vencimientoDia}
              onChange={(e) => setData({ ...data, vencimientoDia: parseInt(e.target.value) || 15 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Banco</label>
            <input
              value={data.banco}
              onChange={(e) => setData({ ...data, banco: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="BBVA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">CLABE</label>
            <input
              value={data.clabe}
              onChange={(e) => setData({ ...data, clabe: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="012 180 0000 0000 00"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#1A3D2B] mb-1">Referencia para colonos</label>
            <input
              value={data.referencia}
              onChange={(e) => setData({ ...data, referencia: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              placeholder="Ej. Número de lote"
            />
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1A3D2B]">Historial de Pagos</h2>
          <button
            onClick={addPago}
            className="text-sm text-[#B8922A] border border-[#B8922A] px-3 py-1 rounded-lg hover:bg-[#B8922A]/10 transition-colors"
          >
            + Agregar fila
          </button>
        </div>
        <div className="space-y-2">
          {data.historial.map((p, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                value={p.mes}
                onChange={(e) => updateHistorial(i, "mes", e.target.value)}
                placeholder="Mes (ej. Mayo 2025)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              />
              <input
                type="number"
                value={p.monto}
                onChange={(e) => updateHistorial(i, "monto", e.target.value)}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              />
              <select
                value={p.estado}
                onChange={(e) => updateHistorial(i, "estado", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8922A]"
              >
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
              </select>
              <button onClick={() => removePago(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
            </div>
          ))}
          {data.historial.length === 0 && (
            <p className="text-gray-400 italic text-sm">Sin historial. Agrega filas arriba.</p>
          )}
        </div>
      </div>

      {msg && <p className="text-sm text-green-600 font-medium">{msg}</p>}
      <button
        onClick={save}
        disabled={loading}
        className="bg-[#1A3D2B] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2A5C40] transition-colors disabled:opacity-60"
      >
        {loading ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
