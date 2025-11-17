<?php

 namespace Database\Seeders;

 use App\Models\Fleet; // <-- JANGAN LUPA IMPORT
 use Illuminate\Database\Console\Seeds\WithoutModelEvents;
 use Illuminate\Database\Seeder;

 class FleetSeeder extends Seeder
 {
     public function run(): void
     {
         Fleet::truncate(); // Hapus data lama

         // Buat 5 armada palsu
         Fleet::factory()->count(5)->create(); 
     }
 }