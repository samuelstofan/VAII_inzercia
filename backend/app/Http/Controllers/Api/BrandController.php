<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\CarModel;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        return response()->json(
            Brand::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
        );
    }

    public function models(Request $request, $brandId)
    {
        Brand::findOrFail($brandId);

        return response()->json(
            CarModel::query()
                ->select(['id', 'name'])
                ->where('brand_id', $brandId)
                ->orderBy('name')
                ->get()
        );
    }
}
