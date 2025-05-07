<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_complete'];

    protected $casts = [
        'is_complete' => 'boolean',
    ];

    public function choices(): BelongsToMany
    {
        return $this->belongsToMany(Choice::class)
            ->withTimestamps();
    }
}
