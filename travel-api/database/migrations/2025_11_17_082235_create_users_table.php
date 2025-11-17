<?php

// database/migrations/..._create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Field Berdasarkan Form Register:
            $table->string('first_name');    // Nama Depan
            $table->string('last_name')->nullable();     // Nama Belakang (dibuat nullable, tapi bisa jadi required)
            $table->string('email')->unique();           // Alamat Email (Harus unik)
            $table->string('phone_number')->unique();    // Nomor Telepon (Harus unik)
            $table->string('password');                  // Kata Sandi

            // Field untuk Role (Tambahan untuk Admin/User):
            $table->enum('role', ['user', 'admin'])->default('user');
            
            // Field Standar Laravel:
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};