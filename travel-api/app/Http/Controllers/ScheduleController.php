<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Ambil input dari Next.js (params: { origin, destination })
            $origin = $request->query('origin');
            $destination = $request->query('destination');

            // Query ke database
            $schedules = Schedule::where('origin', 'LIKE', "%{$origin}%")
                ->where('destination', 'LIKE', "%{$destination}%")
                ->get();

            // Kirim balik ke Next.js
            return response()->json($schedules, 200);
            
        } catch (\Exception $e) {
            // Jika ada error di DB, kirim pesan ini agar terlihat di Console Browser
            return response()->json([
                'error' => 'Gagal mengambil jadwal',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}