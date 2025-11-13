// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Daftar Produk</h1>
      <ul>
        {products.map((p, i) => (
          <li key={i} className="border-b py-2">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
