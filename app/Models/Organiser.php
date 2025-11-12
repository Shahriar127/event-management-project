<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
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

    public function user(): HasOne{
        return $this->hasOne(User::class);
    }
}
