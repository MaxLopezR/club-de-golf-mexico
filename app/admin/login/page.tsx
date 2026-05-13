"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/anuncios");
    } else {
      const data = await res.json();
      setError(data.error || "Error al iniciar sesión");
    }
  }

  return (
    <div className="min-h-screen bg-[#0F2419] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <Image
            src="/images/logo.png"
            alt="Club de Golf México"
            width={72}
            height={72}
            className="object-contain mx-auto mb-5"
          />
          <p className="text-[#B8922A] text-xs uppercase tracking-[0.3em] mb-2">
            Club de Golf México
          </p>
          <h1 className="font-serif text-2xl text-[#F7F3EC] font-normal">
            Panel de Administración
          </h1>
          <div className="w-8 h-px bg-[#B8922A] mx-auto mt-4" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#F7F3EC]/50 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-[#F7F3EC] text-sm placeholder-white/20 focus:outline-none focus:border-[#B8922A] transition-colors rounded-none"
              placeholder="admin@clubdegolfmexico.mx"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#F7F3EC]/50 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-[#F7F3EC] text-sm placeholder-white/20 focus:outline-none focus:border-[#B8922A] transition-colors rounded-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-300 border border-red-400/20 bg-red-400/10 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B8922A] text-white py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#9a7a22] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-[#F7F3EC]/20 text-xs mt-8 tracking-wide">
          Acceso exclusivo · Administradores
        </p>
      </div>
    </div>
  );
}
