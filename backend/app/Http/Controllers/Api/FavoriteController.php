<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;

class FavoriteController extends Controller
{
    /**
     * GET /api/favorites
     */
    public function index(Request $request)
    {
        $vehicles = $request->user()
            ->favoriteVehicles()
            ->with(['images', 'brand', 'model'])
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate(9);

        return response()->json($vehicles);
    }

    /**
     * POST /api/favorites/{vehicle}
     */
    public function store(Request $request, Vehicle $vehicle)
    {
        $request->user()->favoriteVehicles()->syncWithoutDetaching([$vehicle->id]);

        return response()->json([
            'message' => 'Added to favorites.',
        ], 201);
    }

    /**
     * DELETE /api/favorites/{vehicle}
     */
    public function destroy(Request $request, Vehicle $vehicle)
    {
        $request->user()->favoriteVehicles()->detach($vehicle->id);

        return response()->json([
            'message' => 'Removed from favorites.',
        ]);
    }
}
