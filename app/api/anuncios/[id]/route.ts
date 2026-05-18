import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { titulo, contenido, estado, fechaPublicacion } = await req.json();

  const anuncio = await prisma.anuncio.update({
    where: { id },
    data: {
      titulo: titulo?.slice(0, 100),
      contenido: contenido?.slice(0, 500),
      estado,
      fechaPublicacion: fechaPublicacion
        ? new Date(fechaPublicacion)
        : estado === "publicado"
        ? new Date()
        : null,
    },
  });
  return NextResponse.json(anuncio);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.anuncio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
