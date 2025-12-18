<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('bookings', function (Blueprint $table) {
        // user_id adalah foreign key yang merujuk ke kolom 'id' pada tabel 'users'
        $table->foreignId('user_id')
              ->after('id') 
              ->constrained('users') // Laravel otomatis mencari primary key bernama 'id'
              ->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->dropForeign(['user_id']);
        $table->dropColumn('user_id');
    });
}
};
