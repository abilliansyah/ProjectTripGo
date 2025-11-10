<?php

namespace Database\Factories;

use App\Models\Fleet;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class TripFactory extends Factory
{
    public function definition(): array
    {
        $scheduleIds = Schedule::pluck('id')->all();
        $fleetIds = Fleet::pluck('id')->all();

        return [
            'schedule_id' => $this->faker->randomElement($scheduleIds),
            'fleet_id' => $this->faker->randomElement($fleetIds),
            // Buat data trip untuk 7 hari ke depan dari hari ini
            'date' => $this->faker->dateTimeBetween('now', '+7 days')->format('Y-m-d'),
            'status' => 'available',
        ];
    }
}