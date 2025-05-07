<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Choice extends Model
{
    use HasFactory;

    protected $fillable = ['text'];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class)
            ->withTimestamps();
    }
}
