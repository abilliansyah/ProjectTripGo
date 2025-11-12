<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS (Cross-Origin Resource Sharing) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may be
    | executed in web browsers.
    |
    */

    'paths' => ['api/*'], // <-- Pastikan 'api/*' ada di sini

    'allowed_methods' => ['*'],

    'allowed_origins' => [
    'https://project-trip-go.vercel.app/',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // <-- Nanti kita ubah ini

];