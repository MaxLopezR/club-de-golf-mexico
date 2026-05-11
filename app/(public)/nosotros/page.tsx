import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface DirectivaMember {
  cargo: string;
  nombre: string;
}

export default async function NosotrosPage() {
  const info = await prisma.infoNosotros.findFirst();
  const directiva: DirectivaMember[] = info ? JSON.parse(info.directiva) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <section className="bg-[#1A3D2B] rounded-2xl text-white text-center py-12 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Residencial Club de Golf México
        </h1>
        <p className="text-white/60 text-base">Arenal Tepepan · Tlalpan · CDMX</p>
      </section>

      {/* Mesa Directiva */}
      <section>
        <h2 className="text-2xl font-bold text-[#1A3D2B] mb-6 flex items-center gap-2">
          <span>👥</span> Mesa Directiva
        </h2>
        {directiva.length === 0 ? (
          <p className="text-gray-500 italic">Información de directiva no disponible.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {directiva.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#d4cfc7] p-6 text-center shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-[#2A5C40] flex items-center justify-center text-white text-xl mx-auto mb-3">
                  👤
                </div>
                <p className="text-[#B8922A] text-xs font-semibold uppercase tracking-wide mb-1">
                  {member.cargo}
                </p>
                <p className="font-semibold text-[#1A3D2B]">{member.nombre}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Misión & Historia */}
      {info && (
        <section>
          <h2 className="text-2xl font-bold text-[#1A3D2B] mb-6 flex items-center gap-2">
            <span>📖</span> Misión &amp; Historia
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm">
              <h3 className="font-bold text-[#1A3D2B] mb-3 text-lg">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed">{info.mision}</p>
            </div>
            <div className="bg-white rounded-xl border border-[#d4cfc7] p-6 shadow-sm">
              <h3 className="font-bold text-[#1A3D2B] mb-3 text-lg">Historia</h3>
              <p className="text-gray-700 leading-relaxed">{info.historia}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
