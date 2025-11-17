<?php

// routes/api.php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- Rute Public (Tanpa Autentikasi) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Rute Protected (Membutuhkan Token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Rute untuk mengambil data user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Rute contoh yang hanya bisa diakses Admin
    Route::get('/admin-dashboard', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Akses Ditolak: Anda bukan Admin'], 403);
        }
        return response()->json(['message' => 'Selamat datang di Dashboard Admin!']);
    });
});