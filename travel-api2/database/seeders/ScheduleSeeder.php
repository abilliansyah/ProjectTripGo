<?php

 namespace Database\Seeders;

 use App\Models\Schedule; // <-- IMPORT
 use Illuminate\Database\Console\Seeds\WithoutModelEvents;
 use Illuminate\Database\Seeder;

 class ScheduleSeeder extends Seeder
 {
     public function run(): void
     {
         Schedule::truncate();

         Schedule::create([
        'route_id' => 1, // Rute JKT-BDG
        'departure_time' => '08:00:00',
        'arrival_time' => '11:00:00',
        'price' => 150000
        ]); // Jadwal ini akan dapat ID = 1

        // Buat 29 jadwal acak lainnya
        Schedule::factory()->count(29)->create();
     }
 }