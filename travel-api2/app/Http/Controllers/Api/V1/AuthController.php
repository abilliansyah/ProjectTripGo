<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Impor DB facade

class AuthController extends Controller
{
    // Method ini harus sesuai dengan route POST /v1/auth/login
    public function login(Request $request)
    {
        try {
            // Coba lakukan query sederhana untuk menguji koneksi database
            $users = DB::table('users')->limit(1)->get(); 
            
            // Jika query berhasil, kembalikan status OK
            return response()->json([
                'status' => 'success',
                'message' => 'Koneksi database berhasil! API berfungsi.',
                'data' => $users // Tampilkan data user pertama
            ], 200);

        } catch (\Exception $e) {
            // Jika terjadi error (misalnya: koneksi database gagal)
            return response()->json([
                'status' => 'error',
                'message' => 'Koneksi Database GAGAL atau terjadi error server.',
                'error_detail' => $e->getMessage() // Tampilkan detail error (hati-hati di produksi)
            ], 500); 
        }
    }
    
    // Method register (biarkan kosong atau tambahkan tes database serupa)
    public function register(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Route Register Berfungsi. Lakukan tes database di login.'
        ], 200);
    }
}