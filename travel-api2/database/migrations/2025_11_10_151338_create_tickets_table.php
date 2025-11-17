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
        Schema::create('tickets', function (Blueprint $table) {
        $table->id();
        
        // Terhubung ke booking
        $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade'); 
        
        // Sesuaikan dengan diagram Anda
        $table->string('passenger_name');
        $table->string('seat_number', 5); // Misal: "1A", "3B"
        
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
