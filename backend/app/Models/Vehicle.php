<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\VehicleImage;
use App\Models\CarModel;
use App\Models\Brand;

class Vehicle extends Model
{
    protected $fillable = [
        'user_id',
        'brand_id',
        'model_id',
        'title',
        'description',
        'year',
        'mileage',
        'engine_capacity',
        'power',
        'fuel',
        'transmission',
        'drive',
        'price',
        'currency',
        'location',
        'is_active',
        'published_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function images()
    {
        return $this->hasMany(VehicleImage::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function model()
    {
        return $this->belongsTo(CarModel::class, 'model_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
