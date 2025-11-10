<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking; // <-- Import
use App\Models\Ticket;  // <-- Import
use App\Models\Trip;    // <-- Import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Import
use Illuminate\Support\Facades\DB;   // <-- Import
use Illuminate\Support\Str;         // <-- Import
use Illuminate\Validation\ValidationException; // <-- Import

class BookingController extends Controller
{
    /**
     * Menyimpan booking baru.
     */
    public function store(Request $request)
    {
        // 1. Validasi input
        $validated = $request->validate([
            'trip_id' => 'required|integer|exists:trips,id',
            'tickets' => 'required|array|min:1',
            'tickets.*.seat_number' => 'required|string|max:5',
            'tickets.*.passenger_name' => 'required|string|max:255',
        ]);

        // Ambil user yang sedang login
        $user = Auth::user();
        
        // Ambil trip yang akan dibooking
        $trip = Trip::with('schedule', 'fleet')->findOrFail($validated['trip_id']);

        // Ambil daftar kursi yang diminta
        $requestedSeats = collect($validated['tickets'])->pluck('seat_number');

        try {
            // 2. Mulai Transaksi Database
            // Ini akan otomatis 'commit' jika sukses, atau 'rollback' jika gagal
            $booking = DB::transaction(function () use ($trip, $validated, $user, $requestedSeats) {

                // 3. KUNCI & PERIKSA KURSI (Bagian Paling Kritis)
                // Ambil semua nomor kursi yang sudah dipesan untuk trip ini
                // dan KUNCI baris tersebut agar request lain tidak bisa 'membaca'
                // sampai transaksi ini selesai.
                $bookedSeats = Ticket::whereHas('booking', function ($query) use ($trip) {
                    $query->where('trip_id', $trip->id)
                          ->where('status', '!=', 'cancelled'); // Hanya cek booking aktif
                })
                ->lockForUpdate() // <-- INI KUNCINYA!
                ->pluck('seat_number');

                // 4. Cek apakah kursi yang diminta sudah ada yang dipesan
                $alreadyBooked = $requestedSeats->intersect($bookedSeats);
                if ($alreadyBooked->isNotEmpty()) {
                    // Jika ada, batalkan transaksi dengan melempar error
                    throw ValidationException::withMessages([
                        'seats' => 'Kursi ' . $alreadyBooked->implode(', ') . ' sudah dipesan.'
                    ]);
                }

                // 5. Cek Kapasitas Armada
                $totalPassengers = $bookedSeats->count() + $requestedSeats->count();
                if ($totalPassengers > $trip->fleet->capacity) {
                    throw ValidationException::withMessages([
                        'seats' => 'Kapasitas armada tidak mencukupi.'
                    ]);
                }

                // 6. Buat Booking
                $totalPrice = $trip->schedule->price * $requestedSeats->count();

                $booking = $trip->bookings()->create([
                    'user_id' => $user->id,
                    'booking_code' => 'BTM-' . strtoupper(Str::random(6)),
                    'total_price' => $totalPrice,
                    'status' => 'pending', // Status 'pending' sampai dibayar
                ]);

                // 7. Buat Tiket (Data Penumpang)
                $ticketData = [];
                foreach ($validated['tickets'] as $ticket) {
                    $ticketData[] = [
                        'passenger_name' => $ticket['passenger_name'],
                        'seat_number' => $ticket['seat_number'],
                    ];
                }
                $booking->tickets()->createMany($ticketData);

                return $booking; // Kembalikan booking jika sukses

            }); // Transaksi di-commit otomatis di sini

        } catch (ValidationException $e) {
            // Tangkap error validasi (kursi/kapasitas)
            return response()->json($e->errors(), 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            // Tangkap error lainnya (misal: database mati)
            return response()->json([
                'message' => 'Terjadi kesalahan server saat memproses booking.',
                'error' => $e->getMessage()
            ], 500);
        }

        // 8. Berhasil
        // Kembalikan data booking yang baru dibuat beserta tiketnya
        return response()->json($booking->load('tickets'), 201); // 201 = Created
    }
}