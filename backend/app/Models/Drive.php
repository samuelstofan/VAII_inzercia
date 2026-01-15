<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drive extends Model
{
    protected $fillable = ['code', 'label'];

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'drive');
    }
}
