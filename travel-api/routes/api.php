<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- IMPORT CONTROLLER KITA ---
use App\Http\Controllers\Api\V1\CityController;
use App\Http\Controllers\Api\V1\TripSearchController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Ini adalah 'group' yang akan menambahkan /api di depannya
Route::prefix('v1')->group(function () {

    // --- RUTE AUTENTIKASI ---
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']); // Anda mungkin juga butuh ini

    // --- RUTE YANG TERPROTEKSI (HARUS LOGIN) ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/bookings', [App\Http\Controllers\Api\V1\BookingController::class, 'store']);

        // (Nanti rute booking dan lainnya akan masuk ke sini)
    });


    // --- Rute publik Anda yang sudah ada ---
    Route::get('/trips/search', [TripSearchController::class, 'search']);
    Route::apiResource('cities', CityController::class);
});