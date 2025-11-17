<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FleetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'model' => $this->faker->randomElement(['HiAce Premio', 'Travello', 'Elf Long']),
            'license_plate' => 'B ' . $this->faker->numberBetween(1000, 9999) . ' XYZ',
            'capacity' => $this->faker->randomElement([8, 10, 12, 14]),
        ];
    }
}