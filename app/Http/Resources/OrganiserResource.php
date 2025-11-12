<?php

namespace App\Http\Resources;

use App\Models\Organiser;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Organiser */
class OrganiserResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'organiser_id' => $this->organiser_id,
            'organiser_name' => $this->organiser_name,
            'organiser_email' => $this->organiser_email,
            'description' => $this->description,
            'facebook_link' => $this->facebook_link,
            'logo' => $this->logo,
            // Public URL to the stored logo (uses the public disk URL, e.g. /storage/...)
            'logo_url' => $this->logo ? Storage::disk('public')->url($this->logo) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
