<?php

// *****************************************************************
// * KUNCI: QUICK FIX CORS UNTUK MENGATASI PROXY SERVER YANG MEMBLOKIR
// * BARIS INI DITAMBAHKAN DI BAGIAN PALING ATAS SETELAH <?php
// *****************************************************************

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Ganti '*' dengan URL Vercel Anda jika Anda ingin lebih aman, contoh:
    // header('Access-Control-Allow-Origin: https://nama-aplikasi-anda.vercel.app');
    header('Access-Control-Allow-Origin: https://project-trip-go.vercel.app'); 
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

// Menangani permintaan OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        // Echo kembali header yang diminta oleh browser
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    
    // Memberi tahu proxy/browser bahwa request ini berhasil ditangani
    exit(0); 
}

// ... Kode Framework Laravel yang sudah ada

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is maintenance / demo mode via the "down" command
| we will require this file so that we can immediately clear the error
| view and return a simple response immediately. Otherwise, we will
| load the request into the application and allow the application
| to handle the incoming request.
|
*/

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application instance, we can handle the incoming
| request using the application's HTTP kernel implementation, which
| receives the request and sends the response back to the client.
|
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = tap($kernel->handle(
    $request = Request::capture()
))->send();

$kernel->terminate($request, $response);