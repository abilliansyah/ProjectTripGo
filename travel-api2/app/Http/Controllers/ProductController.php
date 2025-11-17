<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        // Contoh dummy data
        return response()->json([
            ['id' => 1, 'name' => 'Produk 1'],
            ['id' => 2, 'name' => 'Produk 2'],
        ]);
    }
}
