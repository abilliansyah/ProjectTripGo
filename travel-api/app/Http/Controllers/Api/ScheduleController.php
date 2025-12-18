<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
{
    $query = Schedule::query();

    if ($request->filled('origin')) {
        // Menggunakan trim() untuk hapus spasi tak sengaja dan strtoupper
        $origin = strtoupper(trim($request->origin));
        $query->where('origin', $origin);
    }

    if ($request->filled('destination')) {
        $destination = strtoupper(trim($request->destination));
        $query->where('destination', $destination);
    }

    $schedules = $query->orderBy('departure_time', 'asc')->get();

    // Log untuk debugging (Cek di storage/logs/laravel.log)
    \Log::info("Pencarian: " . $request->origin . " ke " . $request->destination);
    \Log::info("Ditemukan: " . $schedules->count() . " data");

    return response()->json($schedules);
}
}