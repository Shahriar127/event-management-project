<?php

namespace App\Http\Resources;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Event */
class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'Description' => $this->Description,
            'StartDate' => $this->StartDate,
            'ImageUrl' => $this->ImageUrl,
            'VenueName' => $this->VenueName,
            'AddressLine1' => $this->AddressLine1,
            'AddressLine2' => $this->AddressLine2,
            'City' => $this->City,
            'PostCode' => $this->PostCode,
            'Currency' => $this->Currency,
            'EventVisibility' => $this->EventVisibility,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
