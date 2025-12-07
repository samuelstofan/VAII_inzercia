<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserController;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'getUser']);

Route::middleware('auth:sanctum')->put('/user/update', [UserController::class, 'updateUser']);

Route::middleware('auth:sanctum')->delete('/user/delete', [UserController::class, 'deleteUser']);

Route::get('/sellers', [UserController::class, 'getSellers']);

