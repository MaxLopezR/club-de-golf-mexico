"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin/anuncios", label: "Anuncios" },
  { href: "/admin/nosotros", label: "Nosotros" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/estado-de-cuenta", label: "Estado de Cuenta" },
  { href: "/admin/encuestas", label: "Encuestas" },
  { href: "/admin/correos", label: "Correos" },
];

function SidebarContent({ pathname, onNav, logout }: { pathname: string; onNav?: () => void; logout: () => void }) {
  return (
    <>
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Club de Golf México"
            width={32}
            height={32}
            className="object-contain flex-shrink-0"
          />
          <div>
            <p className="text-[#F7F3EC]/80 text-xs font-serif tracking-wide leading-tight">
              Club de Golf México
            </p>
            <p className="text-[#F7F3EC]/30 text-[10px] tracking-widest uppercase leading-tight mt-0.5">
              Administración
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`flex items-center px-3 py-2.5 text-xs tracking-widest uppercase transition-colors ${
                isActive
                  ? "bg-[#B8922A]/15 text-[#B8922A] border-l-2 border-[#B8922A]"
                  : "text-[#F7F3EC]/40 hover:text-[#F7F3EC]/80 hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          onClick={onNav}
          className="flex items-center px-3 py-2 text-[10px] tracking-widest uppercase text-[#F7F3EC]/25 hover:text-[#F7F3EC]/50 transition-colors"
        >
          Ver sitio
        </Link>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 text-[10px] tracking-widest uppercase text-[#F7F3EC]/25 hover:text-[#F7F3EC]/50 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-[#F7F3EC]">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-52 bg-[#0F2419] flex-shrink-0 flex-col">
        <SidebarContent pathname={pathname} logout={logout} />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-52 bg-[#0F2419] z-50 flex flex-col transition-transform duration-300 md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent pathname={pathname} onNav={() => setDrawerOpen(false)} logout={logout} />
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-4 px-4 py-3 bg-[#0F2419] border-b border-white/10">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-[#F7F3EC]/60 hover:text-[#F7F3EC] transition-colors p-1"
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Image src="/images/logo.png" alt="CGM" width={24} height={24} className="object-contain" />
          <p className="text-[#F7F3EC]/70 text-xs font-serif tracking-wide">Club de Golf México</p>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-10 overflow-x-auto">{children}</div>
      </main>
    </div>
  );
}
