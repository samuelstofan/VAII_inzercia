<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminBrandController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        return response()->json(
            Brand::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
        );
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('brands', 'name')->ignore($id)],
        ]);

        $brand = Brand::findOrFail($id);
        $brand->update([
            'name' => $data['name'],
        ]);

        return response()->json($brand);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        $brand = Brand::findOrFail($id);
        $brand->delete();

        return response()->json([
            'message' => 'Brand deleted.',
        ]);
    }
}
