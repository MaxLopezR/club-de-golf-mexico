import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin inicial
  const hash = await bcrypt.hash("Admin2025!", 10);
  await prisma.admin.upsert({
    where: { email: "admin@clubdegolfmexico.mx" },
    update: {},
    create: {
      email: "admin@clubdegolfmexico.mx",
      password: hash,
    },
  });

  // Info Nosotros
  const nosotrosCount = await prisma.infoNosotros.count();
  if (nosotrosCount === 0) {
    await prisma.infoNosotros.create({
      data: {
        mision:
          "Fomentar la convivencia armónica entre los colonos del Residencial Club de Golf México, preservando el orden, la seguridad y el bienestar común de nuestra comunidad.",
        historia:
          "El Residencial Club de Golf México es una comunidad con décadas de tradición en el sur de la Ciudad de México, ubicada en Arenal Tepepan, Tlalpan. Ha sido hogar de familias que comparten valores de convivencia, respeto y orgullo por su entorno.",
        directiva: JSON.stringify([
          { cargo: "Presidente", nombre: "Ing. J. García" },
          { cargo: "Tesorero", nombre: "Lic. M. López" },
          { cargo: "Vocal", nombre: "Arq. C. Ruiz" },
        ]),
      },
    });
  }

  // Estado de Cuenta inicial
  const estadoCount = await prisma.estadoCuenta.count();
  if (estadoCount === 0) {
    await prisma.estadoCuenta.create({
      data: {
        cuotaMensual: 2500,
        banco: "BBVA",
        clabe: "012 180 0000 0000 00",
        referencia: "Número de lote",
        vencimientoDia: 15,
        historial: {
          create: [
            { mes: "Marzo 2025", monto: 2500, estado: "pagado" },
            { mes: "Abril 2025", monto: 2500, estado: "pagado" },
            { mes: "Mayo 2025", monto: 2500, estado: "pagado" },
          ],
        },
      },
    });
  }

  // Anuncios de ejemplo
  const anuncioCount = await prisma.anuncio.count();
  if (anuncioCount === 0) {
    await prisma.anuncio.createMany({
      data: [
        {
          titulo: "Reunión Ordinaria de Colonos",
          contenido:
            "Se convoca a todos los colonos a la reunión ordinaria del mes. Agenda: revisión de cuotas, mantenimiento de áreas verdes y propuestas de mejora.",
          estado: "publicado",
          fechaPublicacion: new Date(),
        },
        {
          titulo: "Corte de Agua Programado",
          contenido:
            "Se informa que el próximo viernes habrá corte de agua de 9:00 a 14:00 hrs por trabajos de mantenimiento en la red principal.",
          estado: "publicado",
          fechaPublicacion: new Date(),
        },
      ],
    });
  }

  // Eventos de ejemplo
  const eventoCount = await prisma.evento.count();
  if (eventoCount === 0) {
    const now = new Date();
    await prisma.evento.createMany({
      data: [
        {
          titulo: "Torneo Mensual de Socios",
          fecha: new Date(now.getFullYear(), now.getMonth(), 7),
          hora: "08:00",
          lugar: "Campo de Golf",
          descripcion: "Torneo mensual abierto a todos los socios del club.",
        },
        {
          titulo: "Reunión Ordinaria de Colonos",
          fecha: new Date(now.getFullYear(), now.getMonth(), 14),
          hora: "19:00",
          lugar: "Salón de Usos Múltiples",
          descripcion: "Reunión mensual de la mesa directiva con colonos.",
        },
        {
          titulo: "Mantenimiento Área 3",
          fecha: new Date(now.getFullYear(), now.getMonth(), 21),
          hora: "09:00",
          lugar: "Área Verde Norte",
          descripcion: "Poda y mantenimiento general de jardines.",
        },
      ],
    });
  }

  // Encuesta de ejemplo
  const encuestaCount = await prisma.encuesta.count();
  if (encuestaCount === 0) {
    await prisma.encuesta.create({
      data: {
        pregunta: "¿Apruebas el nuevo reglamento de uso de áreas comunes?",
        estado: "activa",
        opciones: {
          create: [
            { texto: "Sí, apruebo" },
            { texto: "No apruebo" },
            { texto: "Me abstengo" },
          ],
        },
      },
    });
  }

  // Colonos de ejemplo
  const colonoCount = await prisma.colono.count();
  if (colonoCount === 0) {
    await prisma.colono.createMany({
      data: [
        { email: "colono1@ejemplo.com", nombre: "Familia García" },
        { email: "colono2@ejemplo.com", nombre: "Familia López" },
        { email: "colono3@ejemplo.com", nombre: "Familia Ruiz" },
      ],
    });
  }

  console.log("✅ Seed completado. Admin: admin@clubdegolfmexico.mx / Admin2025!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
