<?php

namespace Database\Seeders;

// 👇 TAMBAHKAN BARIS INI
use Illuminate\Support\Facades\Schema;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Nonaktifkan pengecekan foreign key
        Schema::disableForeignKeyConstraints();

        // 2. Panggil semua seeder Anda
        // Perintah truncate() di dalam seeder ini sekarang aman dijalankan
        $this->call([
            CitySeeder::class,
            FleetSeeder::class,
            RouteSeeder::class,
            ScheduleSeeder::class,
            TripSeeder::class,
            // (Seeder lain akan ditambahkan di sini)
        ]);

        // 3. Aktifkan kembali pengecekan foreign key
        Schema::enableForeignKeyConstraints();
    }
}