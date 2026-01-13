import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AppNavbar } from "../components/AppNavbar";
import { Providers } from "./providers";

// Configuración de la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Pastas Yamaguchi",
  description: "Plataforma de gestión y venta de Pastas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased bg-white text-gray-900`}>

        {/* Providers envuelve toda la aplicación para que el contexto de Auth esté disponible */}
        <Providers>

          {/* La barra de navegación se muestra en todas las páginas */}
          <AppNavbar />

          {/* El contenedor principal para las páginas (Login, Productos, etc.) */}
          <main className="container mx-auto px-4 py-8 min-h-[75vh]">
            {children}
          </main>

          {/* Un footer sencillo para cerrar el diseño */}
          <footer className="border-t border-gray-200 bg-gray-50 text-center py-6">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Pastas Yamaguchi. Todos los derechos reservados.
            </p>
          </footer>

        </Providers>

      </body>
    </html>
  );
}
