<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\V1\TripSearchResource;
use App\Http\Controllers\Controller;
use App\Models\Trip; // <-- Import model Trip
use Illuminate\Http\Request; // <-- Import Request

class TripSearchController extends Controller
{
    /**
     * Handle the incoming search request.
     */
    public function search(Request $request)
    {
        // 1. Validasi input dari pengguna
        $validated = $request->validate([
            'from_city_id' => 'required|integer|exists:cities,id',
            'to_city_id'   => 'required|integer|exists:cities,id',
            'date'         => 'required|date_format:Y-m-d',
        ]);

        // 2. Logika Query Pencarian
        $trips = Trip::query()
            // Filter berdasarkan tanggal
            ->where('date', $validated['date'])
            
            // Filter relasi: cari Trip yang punya schedule,
            // yang punya route, yang origin_city_id-nya = input
            ->whereHas('schedule.route', function ($query) use ($validated) {
                $query->where('origin_city_id', $validated['from_city_id']);
            })

            // Filter relasi: cari Trip yang punya schedule,
            // yang punya route, yang destination_city_id-nya = input
            ->whereHas('schedule.route', function ($query) use ($validated) {
                $query->where('destination_city_id', $validated['to_city_id']);
            })

            // 3. Eager Loading (Mengambil data relasi agar efisien)
            ->with([
                'fleet', // Ambil data armada (yang sudah di-update: model, license_plate)
                'schedule.route.originCity', // Ambil data kota asal
                'schedule.route.destinationCity' // Ambil data kota tujuan
            ])
            
            ->get();

        // 4. Kembalikan data sebagai JSON
        return TripSearchResource::collection($trips);
    }
}