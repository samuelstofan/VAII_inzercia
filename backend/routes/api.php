<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\AdminBrandController;
use App\Http\Controllers\Api\AdminModelController;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'getUser']);

Route::middleware('auth:sanctum')->put('/user/update', [UserController::class, 'updateUser']);

Route::middleware('auth:sanctum')->delete('/user/delete', [UserController::class, 'deleteUser']);

Route::get('/sellers', [UserController::class, 'getSellers']);;
Route::get('/sellers/{id}', [UserController::class, 'showSeller']);
Route::get('/sellers/{id}/vehicles', [VehicleController::class, 'bySeller']);

Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{id}/models', [BrandController::class, 'models']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::middleware('auth:sanctum')->post('/vehicles', [VehicleController::class, 'store']);
Route::middleware('auth:sanctum')->put('/vehicles/{id}', [VehicleController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/favorites', [FavoriteController::class, 'index']);
Route::middleware('auth:sanctum')->post('/favorites/{vehicle}', [FavoriteController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/favorites/{vehicle}', [FavoriteController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/messages', [MessageController::class, 'index']);
Route::middleware('auth:sanctum')->get('/messages/threads', [MessageController::class, 'threads']);
Route::middleware('auth:sanctum')->post('/messages', [MessageController::class, 'store']);

Route::middleware('auth:sanctum')->get('/admin/users', [AdminUserController::class, 'index']);
Route::middleware('auth:sanctum')->delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/admin/brands', [AdminBrandController::class, 'index']);
Route::middleware('auth:sanctum')->put('/admin/brands/{id}', [AdminBrandController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/admin/brands/{id}', [AdminBrandController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/admin/models', [AdminModelController::class, 'index']);
Route::middleware('auth:sanctum')->put('/admin/models/{id}', [AdminModelController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/admin/models/{id}', [AdminModelController::class, 'destroy']);
