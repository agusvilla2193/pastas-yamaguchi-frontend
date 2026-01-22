'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Hero from '@/components/home/hero';
import About from '@/components/home/about';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ContactInfo from '@/components/home/ContactInfo';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export default function Home() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/products');
        setFavorites(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="bg-neutral-950 text-white selection:bg-red-600/30">
      <Hero />

      <About />

      {!loading && favorites.length > 0 && (
        <FeaturedProducts products={favorites} />
      )}

      <ContactInfo />
    </div>
  );
}
