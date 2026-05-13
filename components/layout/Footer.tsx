import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F2419] text-[#F7F3EC]/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/logo.png"
                alt="Club de Golf México"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-[#F7F3EC]/80 font-serif text-sm tracking-wide">
                Club de Golf México
              </span>
            </div>
            <p className="text-xs tracking-wide">Arenal Tepepan · Tlalpan · CDMX</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/nosotros", label: "Nosotros" },
              { href: "/calendario", label: "Calendario" },
              { href: "/estado-de-cuenta", label: "Estado de Cuenta" },
              { href: "/encuestas", label: "Encuestas" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase hover:text-[#B8922A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© {new Date().getFullYear()} Residencial Club de Golf México · Est. 1949</p>
          <p className="text-xs text-[#F7F3EC]/25">Portal de Colonos</p>
        </div>
      </div>
    </footer>
  );
}
