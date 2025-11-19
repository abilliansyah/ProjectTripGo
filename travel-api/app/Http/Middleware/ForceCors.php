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
        // Ambil Origin dari request (misalnya, https://project-trip-go.vercel.app)
        $origin = $request->headers->get('Origin');
        
        // Atur Allowed Origin. Jika Origin ada, gunakan Origin tersebut. 
        // Ini WAJIB jika Access-Control-Allow-Credentials: true.
        // Jika Origin tidak ada, gunakan default Vercel Anda.
        $allowedOrigin = $origin ?? 'https://project-trip-go.vercel.app';

        // Header standar yang dibutuhkan
        $headers = [
            'Access-Control-Allow-Origin'      => $allowedOrigin,
            'Access-Control-Allow-Methods'     => 'POST, GET, OPTIONS, PUT, DELETE',
            // Menambahkan 'X-Requested-With' karena sering dikirim oleh library seperti Axios
            'Access-Control-Allow-Headers'     => 'Content-Type, X-Auth-Token, Origin, Authorization, Accept, X-Requested-With', 
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // 1. Tangani Preflight OPTIONS Request (Hanya mengirim header CORS)
        if ($request->isMethod('OPTIONS')) {
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