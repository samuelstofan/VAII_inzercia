<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\VehicleImage;
use App\Models\CarModel;
use App\Models\Brand;

class VehicleController extends Controller
{
      /**
     * GET /api/vehicles
     */
    public function index(Request $request)
    {
        $vehicles = Vehicle::query()
            ->with([
                'images',
                'brand',
                'model',
            ])
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate(9);

        return response()->json($vehicles);
    }

    /**
     * GET /api/vehicles/{id}
     */
    public function show($id)
    {
        $vehicle = Vehicle::with([
                'images',
                'brand',
                'model',
                'user',
            ])
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->findOrFail($id);

        return response()->json($vehicle);
    }
}
