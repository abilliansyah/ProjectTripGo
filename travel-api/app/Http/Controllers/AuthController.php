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
     */
    public function register(Request $request)
    {
        // Validasi data input sesuai form Anda
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'required|string|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' membutuhkan field password_confirmation
        ]);

        // Buat user baru di database
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => 'user', // Set default role
        ]);

        // Buat token Sanctum untuk user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201); // 201 Created
    }

    /**
     * Menangani proses login user.
     */
    public function login(Request $request)
    {
        // Validasi data input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Cek apakah user ada dan password valid
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Kredensial tidak valid (Email atau Password salah).',
            ], 401); // 401 Unauthorized
        }

        // Hapus token lama user (opsional, untuk keamanan)
        $user->tokens()->delete(); 
        
        // Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Menangani proses logout user. Membutuhkan token Sanctum.
     */
    public function logout(Request $request)
    {
        // Hapus token yang digunakan saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil logout']);
    }
}