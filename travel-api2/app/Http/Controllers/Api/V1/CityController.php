<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CityResource; // <-- Kita akan butuh ini
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Kembalikan semua kota menggunakan Resource
        return CityResource::collection(City::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // (Nanti kita isi untuk Admin)
    }

    /**
     * Display the specified resource.
     */
    public function show(City $city)
    {
        // Kembalikan satu kota menggunakan Resource
        return CityResource::make($city);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, City $city)
    {
        // (Nanti kita isi untuk Admin)
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(City $city)
    {
        // (Nanti kita isi untuk Admin)
    }
}