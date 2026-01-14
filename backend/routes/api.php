<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\FavoriteController;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'getUser']);

Route::middleware('auth:sanctum')->put('/user/update', [UserController::class, 'updateUser']);

Route::middleware('auth:sanctum')->delete('/user/delete', [UserController::class, 'deleteUser']);

Route::get('/sellers', [UserController::class, 'getSellers']);;
Route::get('/sellers/{id}', [UserController::class, 'showSeller']);
Route::get('/sellers/{id}/vehicles', [VehicleController::class, 'bySeller']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::middleware('auth:sanctum')->post('/vehicles', [VehicleController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/favorites', [FavoriteController::class, 'index']);
Route::middleware('auth:sanctum')->post('/favorites/{vehicle}', [FavoriteController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/favorites/{vehicle}', [FavoriteController::class, 'destroy']);
