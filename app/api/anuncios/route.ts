import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const anuncios = await prisma.anuncio.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(anuncios);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { titulo, contenido, estado } = await req.json();
  if (!titulo || !contenido) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const anuncio = await prisma.anuncio.create({
    data: {
      titulo: titulo.slice(0, 100),
      contenido: contenido.slice(0, 500),
      estado: estado === "publicado" ? "publicado" : "borrador",
      fechaPublicacion: estado === "publicado" ? new Date() : null,
    },
  });
  return NextResponse.json(anuncio, { status: 201 });
}
