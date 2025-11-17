<?php

namespace Database\Seeders;

// Pastikan baris ini ada
use App\Models\City; 

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama agar tidak duplikat
        City::truncate();

        City::create(['name' => 'Jakarta']); // Ini akan dapat ID = 1
        City::create(['name' => 'Bandung']); // Ini akan dapat ID = 2
        City::create(['name' => 'Surabaya']); // Ini akan dapat ID = 3
        City::create(['name' => 'Yogyakarta']); // Ini akan dapat ID = 4

        // Buat 6 data acak lainnya
        City::factory()->count(6)->create();
    }
}