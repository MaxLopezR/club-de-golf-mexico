import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: encuestaId } = await params;
  const { opcionId } = await req.json();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const yaVoto = await prisma.voto.findFirst({
    where: { encuestaId, ip },
  });
  if (yaVoto) {
    return NextResponse.json({ error: "Ya votaste en esta encuesta" }, { status: 400 });
  }

  const encuesta = await prisma.encuesta.findUnique({ where: { id: encuestaId } });
  if (!encuesta || encuesta.estado !== "activa") {
    return NextResponse.json({ error: "Encuesta no disponible" }, { status: 400 });
  }

  await prisma.voto.create({
    data: { encuestaId, opcionId, ip },
  });

  return NextResponse.json({ ok: true });
}
