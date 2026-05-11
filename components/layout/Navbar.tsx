"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/calendario", label: "Calendario" },
  { href: "/estado-de-cuenta", label: "Estado de Cuenta" },
  { href: "/encuestas", label: "Encuestas" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#1A3D2B] shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo + nombre */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#B8922A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              CGM
            </div>
            <span className="text-white font-semibold text-sm hidden sm:block leading-tight">
              Club de Golf México
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#B8922A] text-white"
                      : "text-[#F7F3EC]/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Navegación móvil — scroll horizontal */}
          <nav className="flex md:hidden items-center gap-1 overflow-x-auto max-w-[60vw]">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap px-3 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#B8922A] text-white"
                      : "text-[#F7F3EC]/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
