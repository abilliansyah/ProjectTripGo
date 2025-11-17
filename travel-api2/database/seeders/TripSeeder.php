<?php

 namespace Database\Seeders;

 use App\Models\Trip; // <-- IMPORT
 use Illuminate\Database\Console\Seeds\WithoutModelEvents;
 use Illuminate\Database\Seeder;

 class TripSeeder extends Seeder
 {
     public function run(): void
     {
         Trip::truncate();

    // Tentukan tanggal (misal: besok)
        $searchableDate = now()->addDay()->format('Y-m-d');

    // Buat trip spesifik untuk Jadwal ID 1
         Trip::create([
        'schedule_id' => 1, // Jadwal JKT-BDG jam 8
        'fleet_id' => 1, // Ambil armada pertama
        'date' => $searchableDate,
        'status' => 'available'
        ]);

    // Buat 99 trip acak lainnya
        Trip::factory()->count(99)->create();
     }
 }