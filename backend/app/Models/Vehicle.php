<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\VehicleImage;
use App\Models\CarModel;
use App\Models\Brand;
use App\Models\Fuel;
use App\Models\Transmission;
use App\Models\Drive;

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

    public function fuel()
    {
        return $this->belongsTo(Fuel::class, 'fuel');
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class, 'transmission');
    }

    public function drive()
    {
        return $this->belongsTo(Drive::class, 'drive');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
