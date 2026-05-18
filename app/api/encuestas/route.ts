import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const encuestas = await prisma.encuesta.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      opciones: {
        include: { _count: { select: { votos: true } } },
      },
      _count: { select: { votos: true } },
    },
  });
  return NextResponse.json(encuestas);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { pregunta, opciones, fechaInicio, fechaFin } = await req.json();
  if (!pregunta || !Array.isArray(opciones) || opciones.length < 2) {
    return NextResponse.json({ error: "Pregunta y mínimo 2 opciones requeridas" }, { status: 400 });
  }

  const encuesta = await prisma.encuesta.create({
    data: {
      pregunta: pregunta.slice(0, 200),
      estado: "activa",
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaFin: fechaFin ? new Date(fechaFin) : null,
      opciones: {
        create: opciones.map((texto: string) => ({ texto: texto.slice(0, 100) })),
      },
    },
    include: { opciones: true },
  });
  return NextResponse.json(encuesta, { status: 201 });
}
