<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@tripgo.com', // Email baru untuk admin
            'role' => 'admin', // SET ROLE SEBAGAI ADMIN
            'password' => Hash::make('admin123'), // Ganti dengan password kuat
            'email_verified_at' => now(),
        ]);
    }
}