// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// // Importa el archivo global de estilos de Tailwind CSS
// import "../styles/globals.css"; 

// // Componentes que se usarán en el layout
// import { AppNavbar } from "../components/AppNavbar"; 
// import { Providers } from "./providers"; // Importamos el envoltorio de Contextos

// const inter = Inter({ subsets: ["latin"] });

// // Metadata de la aplicación (para SEO y título de la página)
// export const metadata: Metadata = {
//   title: "Pastas Yamaguchi - eCommerce",
//   description: "Plataforma de gestión y venta de Pastas.",
// };

// // Componente principal del layout
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="es">
//       <body className={inter.className}>
        
//         {/*
//           Providers envuelve todo. Dentro de Providers está el AuthProvider,
//           asegurando que cualquier componente descendiente (incluyendo AppNavbar
//           y todas las páginas en {children}) pueda usar useAuth().
//         */}
//         <Providers> 
//           <AppNavbar /> 
          
//           {/* El contenido específico de cada página (ej: /login, /products) 
//             se renderizará aquí. Usamos un container para centrar el contenido.
//           */}
//           <main className="container mx-auto px-4 my-8 min-h-[70vh]">
//             {children}
//           </main>

//           {/* Footer simple (puedes expandirlo después) */}
//           <footer className="bg-gray-200 text-center py-4 mt-auto">
//             <p className="text-gray-600 text-sm">
//                 &copy; {new Date().getFullYear()} Pastas Yamaguchi. Todos los derechos reservados.
//             </p>
//           </footer>
//         </Providers>
        
//       </body>
//     </html>
//   );
// }