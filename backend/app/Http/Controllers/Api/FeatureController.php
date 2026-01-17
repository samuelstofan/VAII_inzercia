<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;

class FeatureController extends Controller
{
    /**
     * GET /api/features
     */
    public function index()
    {
        return response()->json(
            Feature::query()->orderBy('name')->get()
        );
    }
}
