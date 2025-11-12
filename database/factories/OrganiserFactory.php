<?php

namespace Database\Factories;

use App\Models\Organiser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class OrganiserFactory extends Factory
{
    protected $model = Organiser::class;

    public function definition()
    {
        return [
            'organiser_id' => $this->faker->randomNumber(),
            'organiser_name' => $this->faker->name(),
            'organiser_email' => $this->faker->unique()->safeEmail(),
            'description' => $this->faker->text(),
            'facebook_link' => $this->faker->word(),
            'logo' => $this->faker->word(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
