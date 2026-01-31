'use client';

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppNavbar } from "@/components/AppNavbar";
import { Providers } from "./providers";
import { Toaster } from 'sonner';
import { WhatsAppButton } from "@/components/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // URLs de redes sociales
  const INSTAGRAM_URL = "https://www.instagram.com/pastasyamaguchi";
  const FACEBOOK_URL = "https://www.facebook.com/pastasyamaguchi";

  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-neutral-950 text-white`}>
        <Providers>
          {/* Notificaciones elegantes */}
          <Toaster position="bottom-right" richColors theme="dark" />

          {/* Barra de Navegación */}
          <AppNavbar />

          <main className="min-h-screen">
            {children}
          </main>

          {/* Renderizo el botón aca adentro. 
              Como está dentro de <Providers>, el WhatsAppButton 
              puede usar useAuth() sin dar errores. 
          */}
          <WhatsAppButton />

          <footer className="border-t border-neutral-900 bg-black py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-lg font-black italic tracking-tighter">
                YAMAGUCHI <span className="text-red-600">PASTAS</span>
              </div>

              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                &copy; {new Date().getFullYear()} — Hecho a mano con disciplina
              </p>

              <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
