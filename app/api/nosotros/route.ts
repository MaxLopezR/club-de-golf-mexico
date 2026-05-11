import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const info = await prisma.infoNosotros.findFirst();
  return NextResponse.json(info);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { mision, historia, directiva } = await req.json();
  const existing = await prisma.infoNosotros.findFirst();

  if (existing) {
    const updated = await prisma.infoNosotros.update({
      where: { id: existing.id },
      data: {
        mision: mision?.slice(0, 600) || existing.mision,
        historia: historia?.slice(0, 800) || existing.historia,
        directiva: JSON.stringify(directiva) || existing.directiva,
      },
    });
    return NextResponse.json(updated);
  } else {
    const created = await prisma.infoNosotros.create({
      data: {
        mision: mision?.slice(0, 600) || "",
        historia: historia?.slice(0, 800) || "",
        directiva: JSON.stringify(directiva || []),
      },
    });
    return NextResponse.json(created);
  }
}
