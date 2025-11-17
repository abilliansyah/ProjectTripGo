"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman login
    router.push("/login");
  }, [router]);

  return null; // Tidak menampilkan konten apapun di halaman utama
}
