<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Registrasi user baru.
     */
    public function register(Request $request)
    {
        // 1. Validasi data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // butuh 'password_confirmation'
        ]);

        // 2. Buat user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // 'role' akan otomatis 'customer' (sesuai setup migrasi User kita)
        ]);

        // 3. Login user setelah registrasi
        auth()->login($user);

        // 4. Kembalikan data user
        return response()->json($user, 201); // 201 = Created
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        ]);

    // Coba autentikasi user
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Jika gagal, kirim respon error
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Kode di bawah ini tidak akan jalan, tidak apa-apa
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        auth()->guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Mendapatkan data user yang sedang login.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}