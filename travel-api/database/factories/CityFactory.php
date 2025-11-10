<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    public function definition(): array
    {
        return [
            // faker akan membuat nama kota acak
            'name' => $this->faker->city(), 
        ];
    }
}