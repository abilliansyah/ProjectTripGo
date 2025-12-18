<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // 1. Ambil user dengan aman
        $user = auth()->user();
        
        // 2. Tentukan User ID (dari login atau kiriman manual)
        $userId = $user ? $user->id : $request->user_id;

        // 3. Jika tidak ada User ID sama sekali, hentikan proses
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi anda berakhir atau User ID tidak ditemukan.'
            ], 401);
        }

        // 4. Validasi input
        $validated = $request->validate([
            'schedule_id'    => 'required|exists:schedules,id',
            'customer_name'  => 'required|string|max:255',
            'customer_email' => 'required|email',
            'seat_count'     => 'required|integer|min:1',
            'total_price'    => 'required|numeric',
            'payment_method' => 'nullable|string'
        ]);

        // 5. Buat Order ID Unik
        $orderId = 'TRP-' . time() . '-' . rand(100, 999);

        // 6. Tentukan status awal
        $status = ($request->payment_method === 'tripgo_pay') ? 'success' : 'pending';

        // 7. Simpan data ke database
        // PERHATIKAN: Saya menghapus auth()->user()->first_name yang bikin error
        $booking = Booking::create([
            'user_id'        => $userId, // Gunakan variabel $userId yang sudah dicek
            'order_id'       => $orderId,
            'schedule_id'    => $validated['schedule_id'],
            'customer_name'  => $validated['customer_name'],  // Gunakan data dari input Next.js
            'customer_email' => $validated['customer_email'], // Gunakan data dari input Next.js
            'seat_count'     => $validated['seat_count'],
            'total_amount'   => $validated['total_price'],
            'status'         => $status,
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'data'    => $booking
        ], 201);
    }

    public function show($order_id)
    {
        try {
            $booking = Booking::with('schedule')->where('order_id', $order_id)->first();
            if (!$booking) return response()->json(['message' => 'Not Found'], 404);
            return response()->json($booking);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function checkStatus($orderId)
    {
        try {
            \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY');
            \Midtrans\Config::$isProduction = false;
            \Midtrans\Config::$isSanitized = true;

            $status = \Midtrans\Transaction::status($orderId);
            
            return response()->json([
                'status' => $status->transaction_status,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function myHistory() 
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $data = Booking::with('schedule')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ]);
    }
}