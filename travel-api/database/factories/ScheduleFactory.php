<?php

namespace Database\Factories;

use App\Models\Route; // <-- IMPORT Route
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    public function definition(): array
    {
        // Ambil semua ID rute yang ada
        $routeIds = Route::pluck('id')->all();

        return [
            'route_id' => $this->faker->randomElement($routeIds),
            'departure_time' => $this->faker->randomElement(['08:00:00', '10:00:00', '14:00:00', '19:00:00']),
            'arrival_time' => $this->faker->randomElement(['11:00:00', '13:00:00', '17:00:00', '22:00:00']),
            'price' => $this->faker->randomElement([100000, 120000, 150000, 180000]),
        ];
    }
}