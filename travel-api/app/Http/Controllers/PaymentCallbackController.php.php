<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;

class PaymentCallbackController extends Controller
{
    public function receive(Request $request)
    {
        // 1. Keamanan: Verifikasi Signature Key Midtrans
        $serverKey = config('services.midtrans.serverKey'); // Pastikan server key ada di .env
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Cari Data Booking
        $booking = Booking::where('order_id', $request->order_id)->first();
        if (!$booking) return response()->json(['message' => 'Order not found'], 404);

        $status = $request->transaction_status;

        // 3. Logika Berhasil (Settlement/Capture)
        DB::transaction(function () use ($status, $booking) {
            if ($status == 'settlement' || $status == 'capture') {
                if ($booking->status !== 'success') {
                    $booking->update(['status' => 'success']);

                    // KURANGI KURSI DI TABEL SCHEDULE
                    $schedule = Schedule::find($booking->schedule_id);
                    if ($schedule) {
                        $schedule->decrement('available_seats', $booking->seat_count);
                    }
                }
            } elseif (in_array($status, ['cancel', 'deny', 'expire'])) {
                $booking->update(['status' => 'failed']);
            }
        });

        return response()->json(['message' => 'Callback processed']);
    }
}