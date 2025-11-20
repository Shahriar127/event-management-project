<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organiser_id',
        'Description',
        'StartDate',
        'ImageUrl',
        'VenueName',
        'AddressLine1',
        'AddressLine2',
        'City',
        'PostCode',
        'Currency',
        'EventVisibility',
    ];

    protected function casts(): array
    {
        return [
            'StartDate' => 'date',
        ];
    }

    // An event belongs to one organiser
    public function organiser(): BelongsTo
    {
        return $this->belongsTo(Organiser::class);
    }
}
