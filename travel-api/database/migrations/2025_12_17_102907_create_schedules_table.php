<?php

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
    Schema::create('schedules', function (Blueprint $table) {
        $table->id();
        $table->string('bus_name');
        $table->string('origin');
        $table->string('destination');
        $table->dateTime('departure_time');
        $table->decimal('price', 12, 2);
        
        // Tambahkan kolom yang kurang di bawah ini:
        $table->string('class');           // Kolom class yang menyebabkan error tadi
        $table->integer('total_seats');
        $table->integer('available_seats');
        $table->integer('duration');       // Kolom durasi
        $table->json('stops');             // Kolom stops (menggunakan tipe JSON)
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
