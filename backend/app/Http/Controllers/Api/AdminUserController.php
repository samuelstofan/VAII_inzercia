<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
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
            User::query()
                ->select(['id', 'name', 'email', 'role', 'created_at'])
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        if ((int) $user->id === (int) $id) {
            return response()->json([
                'message' => 'Cannot delete own account.',
            ], 422);
        }

        $target = User::findOrFail($id);
        if ($target->isAdmin()) {
            return response()->json([
                'message' => 'Cannot delete another admin.',
            ], 422);
        }
        $target->delete();

        return response()->json([
            'message' => 'User deleted.',
        ]);
    }
}
