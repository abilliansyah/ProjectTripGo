<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('fleets', function (Blueprint $table) {
            // 1. Ganti nama kolom 'name' menjadi 'model'
            $table->renameColumn('name', 'model');
            
            // 2. Tambahkan kolom license_plate (bisa null)
            $table->string('license_plate')->nullable()->after('model');
        });
    }

    public function down(): void
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->renameColumn('model', 'name');
            $table->dropColumn('license_plate');
        });
    }
};
