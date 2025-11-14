<?php

/**
 * |--------------------------------------------------------------------------
 * | QUICK FIX CORS (UNTUK MENGATASI PROXY RAILWAY / 404 PREFLIGHT)
 * |--------------------------------------------------------------------------
 * | Kode ini akan berjalan sebelum framework dimuat.
 */

// Mendapatkan Origin dari browser
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// =========================================================================
// URL FRONTEND VERCEL SPESIFIK ANDA
// =========================================================================
$allowedOrigin = 'https://project-trip-go-git-main-abilliansyahs-projects.vercel.app'; 
$allowedMethods = 'GET, POST, OPTIONS, PUT, DELETE';
$allowedHeaders = 'Content-Type, X-Auth-Token, Origin, Authorization, X-Requested-With, Accept, Credentials';


if ($origin) {
    // 1. Tambahkan header CORS untuk request normal (termasuk POST/GET)
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

// 2. Jika request adalah OPTIONS (Preflight), tangani dan keluar
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Methods: ' . $allowedMethods);
    
    // Header harus mencerminkan apa yang diminta oleh browser
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header('Access-Control-Allow-Headers: ' . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
    } else {
        header('Access-Control-Allow-Headers: ' . $allowedHeaders);
    }
    
    // Kirim respons 200 OK dan keluar, mencegah request masuk ke framework
    exit(0); 
}

/**
 * |--------------------------------------------------------------------------
 * | KODE LARAVEL STANDAR DIMULAI DI BAWAH INI
 * |--------------------------------------------------------------------------
 */

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

$app = require_once __DIR__.'../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = tap($kernel->handle(
    $request = Request::capture()
))->send();

$kernel->terminate($request, $response);