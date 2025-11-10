<?php

 namespace Database\Seeders;

 use App\Models\Route; // <-- IMPORT
 use Illuminate\Database\Console\Seeds\WithoutModelEvents;
 use Illuminate\Database\Seeder;

 class RouteSeeder extends Seeder
 {
     public function run(): void
     {
         Route::truncate();

         Route::create([
        'origin_city_id' => 1, // Jakarta
        'destination_city_id' => 2, // Bandung
        'estimated_duration' => '3 Jam'
         ]); // Rute ini akan dapat ID = 1

    // Buat 14 rute acak lainnya
        Route::factory()->count(14)->create();
     }
 }