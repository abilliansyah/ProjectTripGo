<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Domain Vercel Anda dan domain lokal
        $allowedOrigins = [
            'https://project-trip-go.vercel.app/',
            'https://project-trip-go-git-main-abilliansyahs-projects.vercel.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://projecttripgo-production.up.railway.app', 
        ];

        // Mendapatkan Origin dari request
        $origin = $request->header('Origin');
        
        // Menentukan Origin yang diizinkan untuk dikirimkan kembali
        $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : '';

        // JIKA request adalah OPTIONS (preflight request), kita kirim header dan langsung respon
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $allowOrigin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, X-Requested-With')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Lanjutkan request ke aplikasi, lalu tambahkan header CORS pada response
        $response = $next($request);

        $response->header('Access-Control-Allow-Origin', $allowOrigin);
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, X-Requested-With');
        $response->header('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}