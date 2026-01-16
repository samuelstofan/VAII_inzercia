<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarModel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminModelController extends Controller
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
            CarModel::query()
                ->with('brand:id,name')
                ->select(['id', 'brand_id', 'name'])
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
            'name' => ['required', 'string', 'max:255'],
        ]);

        $model = CarModel::findOrFail($id);
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('models', 'name')->where('brand_id', $model->brand_id)->ignore($id),
            ],
        ]);

        $model->update([
            'name' => $data['name'],
        ]);

        return response()->json($model->load('brand:id,name'));
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        $model = CarModel::findOrFail($id);
        $model->delete();

        return response()->json([
            'message' => 'Model deleted.',
        ]);
    }
}
