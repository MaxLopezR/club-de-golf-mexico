import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const eventos = await prisma.evento.findMany({ orderBy: { fecha: "asc" } });
  return NextResponse.json(eventos);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { titulo, fecha, hora, lugar, descripcion } = await req.json();
  if (!titulo || !fecha) {
    return NextResponse.json({ error: "Título y fecha son requeridos" }, { status: 400 });
  }

  const evento = await prisma.evento.create({
    data: {
      titulo: titulo.slice(0, 100),
      fecha: new Date(fecha),
      hora: hora || null,
      lugar: lugar || null,
      descripcion: descripcion?.slice(0, 300) || null,
    },
  });
  return NextResponse.json(evento, { status: 201 });
}
