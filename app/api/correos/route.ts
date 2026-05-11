import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendBulkEmail, buildEmailHtml } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { asunto, cuerpo } = await req.json();
  if (!asunto || !cuerpo) {
    return NextResponse.json({ error: "Asunto y cuerpo requeridos" }, { status: 400 });
  }

  const colonos = await prisma.colono.findMany({
    where: { activo: true },
    select: { email: true },
  });

  const emails = colonos.map((c) => c.email);
  if (emails.length === 0) {
    return NextResponse.json({ error: "No hay colonos registrados" }, { status: 400 });
  }

  const html = buildEmailHtml(asunto, cuerpo);
  const result = await sendBulkEmail({ to: emails, subject: asunto, html });

  return NextResponse.json({ ok: true, enviados: emails.length, ...result });
}
