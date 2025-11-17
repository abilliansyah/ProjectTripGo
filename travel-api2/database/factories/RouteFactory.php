<?php

namespace Database\Factories;

use App\Models\City; // <-- IMPORT City
use Illuminate\Database\Eloquent\Factories\Factory;

class RouteFactory extends Factory
{
    public function definition(): array
    {
        // Ambil semua ID kota yang ada
        $cityIds = City::pluck('id')->all();

        return [
            'origin_city_id' => $this->faker->randomElement($cityIds),
            'destination_city_id' => $this->faker->randomElement($cityIds),
            'estimated_duration' => $this->faker->numberBetween(2, 8) . ' Jam',
        ];
    }
}