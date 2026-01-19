<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Get the authenticated user
     */
    public function getUser(Request $request)
    {
        return $request->user();
    }

    /**
     * Update user profile (name and/or seller status)
     */
    public function updateUser(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:32',
            'is_seller' => 'nullable|boolean',
        ]);

        $user = $request->user();

        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        if ($request->has('phone')) {
            $phone = $request->input('phone');
            $user->phone = $phone !== '' ? $phone : null;
        }

        if ($request->has('is_seller')) {
            $user->is_seller = $request->is_seller;
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete user account
     */
    public function deleteUser(Request $request)
    {
        $user = $request->user();

        // TODO: if user has listings, handle them

        $user->delete();

        return response()->json([
            "message" => "User deleted"
        ]);
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }

    /**
     * Get all sellers
     */
    public function getSellers()
    {
        return User::where('is_seller', true)->get();
    }

    /**
     * Get single seller
     */
    public function showSeller($id)
    {
        return User::where('is_seller', true)->findOrFail($id);
    }
}
