<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\VehicleImage;
use App\Models\CarModel;
use App\Models\Brand;
use Illuminate\Http\UploadedFile;

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
    public function show(Request $request, $id)
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

        $vehicle->is_favorite = false;
        if ($request->user()) {
            $vehicle->is_favorite = $request
                ->user()
                ->favoriteVehicles()
                ->where('vehicle_id', $vehicle->id)
                ->exists();
        }

        return response()->json($vehicle);
    }

    /**
     * POST /api/vehicles
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'primary_image' => ['nullable', 'file', 'image', 'max:4096'],
            'brand_id' => ['nullable', 'exists:brands,id', 'required_without:brand_name'],
            'brand_name' => ['nullable', 'string', 'max:255', 'required_without:brand_id'],
            'model_id' => ['nullable', 'exists:models,id', 'required_without:model_name'],
            'model_name' => ['nullable', 'string', 'max:255', 'required_without:model_id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'year' => ['required', 'integer', 'between:1900,2100'],
            'mileage' => ['required', 'integer', 'min:0'],
            'engine_capacity' => ['nullable', 'integer', 'min:0'],
            'power' => ['nullable', 'integer', 'min:0'],
            'fuel' => ['required', 'in:petrol,diesel,electric,hybrid,lpg'],
            'transmission' => ['required', 'in:manual,automatic'],
            'drive' => ['nullable', 'in:fwd,rwd,awd'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'location' => ['required', 'string', 'max:255'],
            'images' => ['nullable'],
            'images.*' => ['file', 'image', 'max:4096'],
        ]);

        $brand = null;
        if ($request->filled('brand_id')) {
            $brand = Brand::findOrFail($request->input('brand_id'));
        } else {
            $brand = Brand::firstOrCreate(['name' => $request->input('brand_name')]);
        }

        if ($request->filled('model_id')) {
            $model = CarModel::findOrFail($request->input('model_id'));
            if ($brand && $model->brand_id !== $brand->id) {
                return response()->json([
                    'message' => 'Model does not match brand.',
                ], 422);
            }
            $brand = $brand ?: Brand::findOrFail($model->brand_id);
        } else {
            $model = CarModel::firstOrCreate([
                'brand_id' => $brand->id,
                'name' => $request->input('model_name'),
            ]);
        }

        $vehicle = Vehicle::create([
            'user_id' => $request->user()->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'year' => $validated['year'],
            'mileage' => $validated['mileage'],
            'engine_capacity' => $validated['engine_capacity'] ?? null,
            'power' => $validated['power'] ?? null,
            'fuel' => $validated['fuel'],
            'transmission' => $validated['transmission'],
            'drive' => $validated['drive'] ?? null,
            'price' => $validated['price'],
            'currency' => $validated['currency'] ?? 'EUR',
            'location' => $validated['location'],
            'is_active' => true,
            'published_at' => now(),
        ]);

        $images = $request->file('images', []);
        if ($images instanceof UploadedFile) {
            $images = [$images];
        }
        if (!is_array($images)) {
            $images = [];
        }
        $primaryImage = $request->file('primary_image');
        $totalImages = count($images) + ($primaryImage ? 1 : 0);
        if ($totalImages > 10) {
            return response()->json([
                'message' => 'Maximum number of images is 10.',
            ], 422);
        }
        if ($primaryImage) {
            $path = $primaryImage->store("id{$vehicle->id}", 's3');
            VehicleImage::create([
                'vehicle_id' => $vehicle->id,
                'path' => $path,
                'is_primary' => true,
            ]);
        }
        if (!empty($images)) {
            foreach ($images as $image) {
                $path = $image->store("id{$vehicle->id}", 's3');
                VehicleImage::create([
                    'vehicle_id' => $vehicle->id,
                    'path' => $path,
                    'is_primary' => false,
                ]);
            }
        }

        return response()->json(
            $vehicle->load(['images', 'brand', 'model']),
            201
        );
    }

    /**
     * GET /api/sellers/{id}/vehicles
     */
    public function bySeller(Request $request, $id)
    {
        $vehicles = Vehicle::query()
            ->with([
                'images',
                'brand',
                'model',
            ])
            ->where('user_id', $id)
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate(9);

        return response()->json($vehicles);
    }
}
