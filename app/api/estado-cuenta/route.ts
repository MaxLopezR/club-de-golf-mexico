import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const estado = await prisma.estadoCuenta.findFirst({
    include: { historial: { orderBy: { id: "desc" } } },
  });
  return NextResponse.json(estado);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { cuotaMensual, banco, clabe, referencia, vencimientoDia, historial } = await req.json();
  const existing = await prisma.estadoCuenta.findFirst();

  if (existing) {
    await prisma.estadoCuenta.update({
      where: { id: existing.id },
      data: { cuotaMensual, banco, clabe, referencia, vencimientoDia },
    });

    if (Array.isArray(historial)) {
      await prisma.pagoHistorial.deleteMany({ where: { estadoCuentaId: existing.id } });
      await prisma.pagoHistorial.createMany({
        data: historial.map((h: { mes: string; monto: number; estado: string }) => ({
          mes: h.mes,
          monto: h.monto,
          estado: h.estado,
          estadoCuentaId: existing.id,
        })),
      });
    }

    const updated = await prisma.estadoCuenta.findFirst({
      include: { historial: { orderBy: { id: "desc" } } },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.estadoCuenta.create({
    data: {
      cuotaMensual: cuotaMensual || 0,
      banco: banco || "",
      clabe: clabe || "",
      referencia: referencia || "",
      vencimientoDia: vencimientoDia || 15,
    },
    include: { historial: true },
  });
  return NextResponse.json(created);
}
