<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Ticket;
use App\Models\Order;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'Title',
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

    // An event can have many tickets
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    // Orders placed for this event
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
