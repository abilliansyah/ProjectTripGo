<?php

// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Menangani proses registrasi user baru.
     * Pastikan password di-hash dengan benar sebelum disimpan.
     * Endpoint: /api/register
     * Response: 201 Created
     */
    public function register(Request $request)
    {
        // 1. Validasi data input
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'required|string|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' membutuhkan field password_confirmation
        ]);

        // 2. Buat user baru di database (KRITIS: Password di-hash)
        $user = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'phone_number' => $validatedData['phone_number'],
            'password' => Hash::make($validatedData['password']), // WAJIB Hash::make()
            'role' => 'user', // Set default role
        ]);

        // 3. Buat token Sanctum untuk user
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kirim response 201 Created
        return response()->json([
            'user' => $user,
            'access_token' => $token, // Gunakan access_token agar sesuai dengan yang diambil di frontend
            'token_type' => 'Bearer',
        ], 201); 
    }

    /**
     * Menangani proses login user.
     * Menggunakan Auth::attempt() untuk verifikasi yang lebih bersih.
     * Endpoint: /api/login
     * Response: 200 OK atau 401 Unauthorized
     */
    public function login(Request $request)
    {
        // 1. Validasi data input
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Coba Otentikasi dengan email dan password menggunakan Auth::attempt()
        if (!Auth::attempt($credentials)) {
            // Jika Gagal, kembalikan 401 Unauthorized
            return response()->json([
                'message' => 'Kredensial tidak valid (Email atau Password salah).',
            ], 401); 
        }

        // 3. Jika Berhasil, ambil user
        $user = Auth::user();

        // 4. Hapus token lama user (opsional, untuk keamanan)
        // Ini memastikan hanya satu token yang aktif per user/session.
        $user->tokens()->delete(); 
        
        // 5. Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6. Kembalikan response sukses (sesuai dengan yang diharapkan frontend)
        return response()->json([
            'user' => $user,
            'access_token' => $token, // Kunci yang digunakan di frontend Next.js Anda
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Menangani proses logout user. Membutuhkan token Sanctum yang valid.
     * Endpoint: /api/logout (membutuhkan middleware 'auth:sanctum')
     * Response: 200 OK
     */
    public function logout(Request $request)
    {
        // Hapus token yang digunakan saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil logout']);
    }
}