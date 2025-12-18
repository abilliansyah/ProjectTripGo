<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'origin',
        'destination',
        'departure_time',
        'arrival_time',
        'price',
        'class',
        'available_seats',
        'stops',
    ];

    // --- FITUR CASTING ---
    protected $casts = [
        'departure_time' => 'datetime:H:i', // Mengubah 14:00:00 menjadi 14:00
        'arrival_time'   => 'datetime:H:i',
        'stops'          => 'array',
        'price'          => 'integer',
        'available_seats' => 'integer',
    ];
}