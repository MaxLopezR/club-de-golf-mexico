"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/anuncios", label: "📢 Anuncios" },
  { href: "/admin/nosotros", label: "👥 Nosotros" },
  { href: "/admin/calendario", label: "📅 Calendario" },
  { href: "/admin/estado-de-cuenta", label: "🧾 Estado de Cuenta" },
  { href: "/admin/encuestas", label: "📊 Encuestas" },
  { href: "/admin/correos", label: "✉️ Correos" },
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
      <aside className="w-56 bg-[#1A3D2B] text-white flex-shrink-0 flex flex-col">
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#B8922A] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              CGM
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">Panel Admin</p>
              <p className="text-white/40 text-xs leading-tight">Club de Golf México</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#B8922A] text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
