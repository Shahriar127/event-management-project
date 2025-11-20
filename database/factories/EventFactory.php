<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'Description' => $this->faker->text(),
            'StartDate' => Carbon::now(),
            'ImageUrl' => $this->faker->imageUrl(),
            'VenueName' => $this->faker->name(),
            'AddressLine1' => $this->faker->address(),
            'AddressLine2' => $this->faker->address(),
            'City' => $this->faker->city(),
            'PostCode' => $this->faker->word(),
            'Currency' => $this->faker->word(),
            'EventVisibility' => $this->faker->word(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
