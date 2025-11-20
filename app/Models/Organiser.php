<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organiser extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organiser_id',
        'organiser_name',
        'organiser_email',
        'description',
        'facebook_link',
        'logo',
    ];

    // An organiser belongs to a user (user_id)
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    // An organiser can have many events
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
