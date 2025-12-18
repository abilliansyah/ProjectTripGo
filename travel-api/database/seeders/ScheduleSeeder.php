<?php

namespace Database\Seeders;

use App\Models\Schedule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bersihkan tabel dengan aman
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schedule::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $cities = [
            'CILEGON', 'SERANG', 'TANGERANG', 'JAKARTA', 'BOGOR', 
            'BANDUNG', 'CIREBON', 'TEGAL', 'PEKALONGAN', 'SEMARANG', 
            'SALATIGA', 'SOLO', 'YOGYAKARTA', 'MADIUN', 'SURABAYA'
        ];

        // Konfigurasi kelas disesuaikan dengan kapasitas tabel baru
        $classConfigs = [
            'REGULER' => ['multiplier' => 1.0, 'total_seats' => 14],
            'EXECUTIVE' => ['multiplier' => 1.5, 'total_seats' => 10],
            'ROYAL CLASS' => ['multiplier' => 2.0, 'total_seats' => 6],
        ];

        foreach ($cities as $originIndex => $origin) {
            foreach ($cities as $destIndex => $destination) {
                if ($origin === $destination) continue;

                $distance = abs($destIndex - $originIndex);
                $basePrice = 50000 + ($distance * 25000); 

                foreach ($classConfigs as $className => $config) {
                    $finalPrice = $basePrice * $config['multiplier'];
                    $times = ['08:00:00', '20:00:00'];

                    foreach ($times as $time) {
                        // Sesuaikan dengan nama kolom migration baru
                        Schedule::create([
                            'bus_name' => 'TRIPGO - ' . $className, // Tambahkan field bus_name
                            'origin' => $origin,
                            'destination' => $destination,
                            'departure_time' => date('Y-m-d') . ' ' . $time, // Format DateTime penuh
                            'price' => $finalPrice,
                            'class' => $className,
                            'total_seats' => $config['total_seats'],    // Kapasitas Maksimal
                            'available_seats' => $config['total_seats'], // Awalnya kursi masih utuh
                            // Field tambahan jika masih diperlukan di UI:
                            'duration' => max(2, $distance * 1),
                            'stops' => json_encode([$origin, 'Rest Area', $destination]),
                        ]);
                    }
                }
            }
        }
    }
}