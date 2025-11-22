<?php

namespace App\Http\Resources;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Ticket */
class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'TicketTitle' => $this->TicketTitle,
            'TicketPrice' => $this->TicketPrice,
            'QuantityAvailable' => $this->QuantityAvailable,
            'BackgroundColor' => $this->BackgroundColor,
            'BorderColor' => $this->BorderColor,
            'TextColor' => $this->TextColor,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
