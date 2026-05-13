"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/anuncios", label: "Anuncios" },
  { href: "/admin/nosotros", label: "Nosotros" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/estado-de-cuenta", label: "Estado de Cuenta" },
  { href: "/admin/encuestas", label: "Encuestas" },
  { href: "/admin/correos", label: "Correos" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-[#F7F3EC]">
      {/* Sidebar */}
      <aside className="w-52 bg-[#0F2419] flex-shrink-0 flex flex-col">
        {/* Logo */}
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

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
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
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 md:p-10">{children}</div>
      </main>
    </div>
  );
}
