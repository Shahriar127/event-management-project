<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        return [
            'TicketTitle' => $this->faker->word(),
            'TicketPrice' => $this->faker->randomFloat(),
            'QuantityAvailable' => $this->faker->randomNumber(),
            'BackgroundColor' => $this->faker->word(),
            'BorderColor' => $this->faker->word(),
            'TextColor' => $this->faker->text(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
