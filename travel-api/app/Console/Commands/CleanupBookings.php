<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanupBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-bookings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Hapus booking status 'pending' yang umurnya lebih dari 120 menit (2 jam)
        \App\Models\Booking::where('status', 'pending')
        ->where('created_at', '<', now()->subMinutes(120))
        ->delete();
    
        $this->info('Tiket hangus telah dibersihkan.');
    }
}
