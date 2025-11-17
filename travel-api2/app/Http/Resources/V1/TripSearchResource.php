<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TripSearchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // 'this' merujuk ke model 'Trip'
        return [
            // Data dari tabel 'trips'
            'trip_id' => $this->id,
            
            // Data diambil dari relasi (diratakan)
            'origin_city' => $this->schedule->route->originCity->name,
            'destination_city' => $this->schedule->route->destinationCity->name,
            'departure_time' => $this->schedule->departure_time,
            'arrival_time' => $this->schedule->arrival_time,
            'price' => $this->schedule->price,
            
            // Data fleet (sesuai diagram Anda)
            'fleet_model' => $this->fleet->model,
            'fleet_license_plate' => $this->fleet->license_plate,
            'fleet_capacity' => $this->fleet->capacity,
        ];
    }
}