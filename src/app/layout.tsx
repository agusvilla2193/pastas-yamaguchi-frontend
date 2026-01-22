import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppNavbar } from "@/components/AppNavbar";
import { Providers } from "./providers";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Yamaguchi Pastas | Tradición Artesanal",
  description: "La precisión del arte japonés en el corazón de la pasta italiana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-neutral-950 text-white`}>
        <Providers>
          {/* Notificaciones elegantes */}
          <Toaster position="bottom-right" richColors theme="dark" />

          <AppNavbar />

          <main className="min-h-screen">
            {children}
          </main>

          <footer className="border-t border-neutral-900 bg-black py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-lg font-black italic tracking-tighter">
                YAMAGUCHI <span className="text-red-600">PASTAS</span>
              </div>

              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                &copy; {new Date().getFullYear()} — Hecho a mano con disciplina
              </p>

              <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <a href="#" className="hover:text-red-600 transition-colors">Instagram</a>
                <a href="#" className="hover:text-red-600 transition-colors">Facebook</a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
