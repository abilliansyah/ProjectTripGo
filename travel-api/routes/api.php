<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentCallbackController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Rute Public (Tanpa Autentikasi) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/schedules', [ScheduleController::class,'index']);
Route::post('/bookings', [BookingController::class,'store']);
Route::post('/payment/callback', [PaymentCallbackController::class, 'receive']);
Route::get('/bookings/status/{order_id}', [BookingController::class, 'checkStatus']);
Route::get('/bookings/{order_id}', [BookingController::class, 'show']);
// Ambil history berdasarkan email (karena biasanya tamu tidak login)
Route::get('/bookings/history/{email}', [BookingController::class, 'history']);
Route::middleware('auth:sanctum')->get('/my-history', [BookingController::class, 'myHistory']);
Route::get('/run-seeder', function () {
    Artisan::call('db:seed', ['--force' => true]);
    return "Seeder berhasil dijalankan!";
});

// --- Rute Protected (Membutuhkan Token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/admin-dashboard', function (Request $request) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Akses Ditolak: Anda bukan Admin'], 403);
        }
        return response()->json(['message' => 'Selamat datang di Dashboard Admin!']);
    });
}); 