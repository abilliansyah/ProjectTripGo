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
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->string('order_id')->unique(); // ID unik untuk Midtrans (Contoh: TRG-173443)
        $table->foreignId('schedule_id')->constrained('schedules')->onDelete('cascade');
        $table->string('customer_name');
        $table->string('customer_email');
        $table->integer('seat_count');        // Jumlah kursi yang dibeli
        $table->decimal('total_amount', 12, 2);
        $table->string('status')->default('pending'); // pending, success, failed
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
