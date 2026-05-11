import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const colonos = await prisma.colono.findMany({
    where: { activo: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(colonos);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { email, nombre } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const colono = await prisma.colono.upsert({
    where: { email },
    update: { nombre, activo: true },
    create: { email, nombre },
  });
  return NextResponse.json(colono, { status: 201 });
}
