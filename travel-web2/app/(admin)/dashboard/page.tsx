// app/admin/dashboard/page.tsx

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard Utama</h2>
      <p className="text-gray-600">Ringkasan cepat performa sistem dan aktivitas terkini.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contoh Kartu Statistik */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">1,200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-500">Pemesanan Bulan Ini</h3>
          <p className="text-3xl font-bold text-gray-900">450</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-500">Pendapatan (Simulasi)</h3>
          <p className="text-3xl font-bold text-gray-900">Rp 125 Juta</p>
        </div>
      </div>
      
      {/* Bagian lain seperti "Aktivitas Terbaru" */}
    </div>
  );
}