<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class VehicleImage extends Model
{
    protected $fillable = [
        'vehicle_id',
        'path',
        'is_primary',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return Storage::disk('s3')->temporaryUrl(
            $this->path,
            now()->addMinutes(15)
        );
    }
}
