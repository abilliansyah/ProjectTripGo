<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'fleet_id',
        'date',
        'status', // 'available', 'full', 'departed', 'cancelled'
    ];

    // Relasi ke template jadwalnya
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    // Relasi ke armada yang dipakai
    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }
}