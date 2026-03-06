import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* Esta opción es la más importante para Docker. 
     Crea una carpeta comprimida con solo lo necesario para ejecutar el servidor,
     reduciendo el tamaño de la imagen de ~1GB a ~150MB.
  */
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
