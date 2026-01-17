<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public const USER = 1;
    public const ADMIN = 2;

    public $incrementing = false;

    protected $fillable = ['id', 'code', 'label'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
