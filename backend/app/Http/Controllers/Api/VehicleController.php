<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleImage;
use App\Models\CarModel;
use App\Models\Brand;
use App\Models\Fuel;
use App\Models\Transmission;
use App\Models\Drive;
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
                'fuel',
                'transmission',
                'drive',
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
                'fuel',
                'transmission',
                'drive',
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
        if ($request->input('drive') === '') {
            $request->merge(['drive' => null]);
        }

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
            'fuel' => ['required', 'string', 'exists:fuels,code'],
            'transmission' => ['required', 'string', 'exists:transmissions,code'],
            'drive' => ['nullable', 'string', 'exists:drives,code'],
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

        $fuelId = Fuel::where('code', $validated['fuel'])->firstOrFail()->id;
        $transmissionId = Transmission::where('code', $validated['transmission'])->firstOrFail()->id;
        $driveId = isset($validated['drive'])
            ? Drive::where('code', $validated['drive'])->firstOrFail()->id
            : null;

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
            'fuel' => $fuelId,
            'transmission' => $transmissionId,
            'drive' => $driveId,
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
            $vehicle->load(['images', 'brand', 'model', 'fuel', 'transmission', 'drive']),
            201
        );
    }

    /**
     * PUT /api/vehicles/{id}
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::with('images')->findOrFail($id);

        $user = $request->user();
        if ($vehicle->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        if ($request->input('drive') === '') {
            $request->merge(['drive' => null]);
        }

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
            'fuel' => ['required', 'string', 'exists:fuels,code'],
            'transmission' => ['required', 'string', 'exists:transmissions,code'],
            'drive' => ['nullable', 'string', 'exists:drives,code'],
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

        $fuelId = Fuel::where('code', $validated['fuel'])->firstOrFail()->id;
        $transmissionId = Transmission::where('code', $validated['transmission'])->firstOrFail()->id;
        $driveId = isset($validated['drive'])
            ? Drive::where('code', $validated['drive'])->firstOrFail()->id
            : null;

        $vehicle->update([
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'year' => $validated['year'],
            'mileage' => $validated['mileage'],
            'engine_capacity' => $validated['engine_capacity'] ?? null,
            'power' => $validated['power'] ?? null,
            'fuel' => $fuelId,
            'transmission' => $transmissionId,
            'drive' => $driveId,
            'price' => $validated['price'],
            'currency' => $validated['currency'] ?? 'EUR',
            'location' => $validated['location'],
        ]);

        $hasNewImages = $request->hasFile('primary_image') || $request->hasFile('images');
        if ($hasNewImages) {
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

            Storage::disk('s3')->deleteDirectory("id{$vehicle->id}");
            $vehicle->images()->delete();

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
        }

        return response()->json(
            $vehicle->load(['images', 'brand', 'model', 'fuel', 'transmission', 'drive'])
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
                'fuel',
                'transmission',
                'drive',
            ])
            ->where('user_id', $id)
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate(9);

        return response()->json($vehicles);
    }

    /**
     * POST /api/vehicles/{id}/report
     */
    public function report(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $authId = $request->user()->id;

        $adminIds = User::query()
            ->where('role', 'admin')
            ->where('id', '!=', $authId)
            ->pluck('id');

        if ($adminIds->isEmpty()) {
            return response()->json([
                'message' => 'No admin users available.',
            ], 422);
        }

        $messageText = $validated['message'] ?? 'Listing reported.';

        foreach ($adminIds as $adminId) {
            Message::create([
                'sender_id' => $authId,
                'receiver_id' => $adminId,
                'vehicle_id' => $vehicle->id,
                'message' => $messageText,
                'is_read' => false,
            ]);
        }

        return response()->json([
            'message' => 'Report sent.',
        ], 201);
    }

    /**
     * DELETE /api/vehicles/{id}
     */
    public function destroy(Request $request, $id)
    {
        $vehicle = Vehicle::with('images')->findOrFail($id);

        $user = $request->user();
        if ($vehicle->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        Storage::disk('s3')->deleteDirectory("id{$vehicle->id}");
        $vehicle->delete();

        return response()->json([
            'message' => 'Listing deleted.',
        ]);
    }
}
