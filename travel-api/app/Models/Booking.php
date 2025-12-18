<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'schedule_id',
        'customer_name',
        'customer_email',
        'seat_count',    // PERBAIKAN: Ganti 'passengers' menjadi 'seat_count'
        'total_amount',  // PERBAIKAN: Ganti 'total_price' menjadi 'total_amount'
        'status',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}