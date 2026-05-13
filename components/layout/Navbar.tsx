"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/calendario", label: "Calendario" },
  { href: "/estado-de-cuenta", label: "Estado de Cuenta" },
  { href: "/encuestas", label: "Encuestas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="bg-[#0F2419] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <div className="w-8 h-8 border border-[#B8922A] flex items-center justify-center">
              <span className="text-[#B8922A] text-xs font-serif font-medium tracking-wider">CGM</span>
            </div>
            <span className="text-[#F7F3EC] font-serif text-sm tracking-wide hidden sm:block">
              Club de Golf México
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-colors pb-0.5 ${
                  isActive(link.href)
                    ? "text-[#B8922A] border-b border-[#B8922A]"
                    : "text-[#F7F3EC]/60 hover:text-[#F7F3EC]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-[#F7F3EC]/70 hover:text-[#F7F3EC]"
            aria-label="Menú"
          >
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? "rotate-45 translate-y-[8.5px]" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? "-rotate-45 -translate-y-[8.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0F2419]">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-0 py-3 text-xs tracking-widest uppercase border-b border-white/5 transition-colors ${
                  isActive(link.href)
                    ? "text-[#B8922A]"
                    : "text-[#F7F3EC]/60 hover:text-[#F7F3EC]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
