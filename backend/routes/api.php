<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->put('/user/update', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'nullable|string|max:255',
        'is_seller' => 'nullable|boolean',
    ]);

    $user = $request->user();

    if ($request->filled('name')) {
        $user->name = $request->name;
    }

    if ($request->has('is_seller')) {
        $user->is_seller = $request->is_seller;
    }

    $user->save();

    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user
    ]);
});


Route::middleware('auth:sanctum')->delete('/user/delete', function (\Illuminate\Http\Request $request) {
    $user = $request->user();

    // ak má user inzeráty TODO


    $user->delete();

    return response()->json([
        "message" => "User deleted"
    ]);
});

Route::get('/sellers', function () {
    return User::where('is_seller', true)->get();
});
