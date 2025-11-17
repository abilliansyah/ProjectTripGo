// app/page.tsx

// Tipe data untuk respons dari API Laravel
interface ApiResponse {
  message: string;
}

// Ambil URL Base API dari .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getData(): Promise<ApiResponse> {
  // Pastikan variabel lingkungan sudah diatur (lihat langkah 3 sebelumnya)
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
  }
  
  const endpoint = `${API_BASE_URL}/api/hello`;
  
  const res = await fetch(endpoint, {
    // Force dynamic rendering (optional, tergantung kebutuhan cache Anda)
    cache: 'no-store', 
  });

  if (!res.ok) {
    // Menampilkan error jika fetch gagal
    throw new Error(`Failed to fetch data from ${endpoint}. Status: ${res.status}`);
  }

  // Melakukan cast hasil ke tipe ApiResponse
  return res.json() as Promise<ApiResponse>;
}

// Default export untuk halaman
export default async function HomePage() {
  let data: ApiResponse;
  
  try {
    data = await getData();
  } catch (error) {
    // Penanganan error sederhana
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h1>Error Loading Data</h1>
        <p>{error instanceof Error ? error.message : "An unknown error occurred"}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Laravel API Response (Next.js TSX)</h1>
      {/* Akses properti dengan aman */}
      <p>Pesan dari Backend: <strong>{data.message}</strong></p>
      <p>Dihubungkan ke: <code>{API_BASE_URL}/api/hello</code></p>
    </div>
  );
}