<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCors
{
    /**
     * Menambahkan secara paksa header CORS yang dibutuhkan browser.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Tentukan Origin Vercel Anda
        $allowedOrigin = 'https://project-trip-go.vercel.app';
        
        // Header standar yang dibutuhkan
        $headers = [
            'Access-Control-Allow-Origin'      => $allowedOrigin,
            'Access-Control-Allow-Methods'     => 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers'     => 'Content-Type, X-Auth-Token, Origin, Authorization, Accept',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // 1. Tangani Preflight OPTIONS Request
        // Browser akan mengirim OPTIONS request sebelum POST/PUT
        if ($request->isMethod('OPTIONS')) {
            // Berikan respons 200 OK dengan semua header CORS
            return response('OK', 200)->withHeaders($headers);
        }

        // 2. Proses Request Normal
        $response = $next($request);

        // 3. Tambahkan Header CORS ke Response Normal
        foreach ($headers as $key => $value) {
            $response->header($key, $value);
        }
        
        return $response;
    }
}