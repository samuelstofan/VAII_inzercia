<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->put('/user/update', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $user = $request->user();
    $user->name = $request->name;
    $user->save();

    return response()->json([
        'message' => 'Name updated successfully',
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
