<?php

// travel-api/config/cors.php

return [
    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'v1/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Mengizinkan domain Vercel Anda dan domain lokal
    'allowed_origins' => [
        'https://project-trip-go-git-main-abilliansyahs-projects.vercel.app', // Domain Vercel Anda
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        'https://projecttripgo-production.up.railway.app', 
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];