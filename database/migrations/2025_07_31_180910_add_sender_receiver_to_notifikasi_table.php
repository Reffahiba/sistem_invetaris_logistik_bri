<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            $table->unsignedBigInteger('id_sender')->nullable()->after('id_user');
            $table->unsignedBigInteger('id_receiver')->nullable()->after('id_sender');

            // Kalau kamu mau buat foreign key (opsional, kalau id_sender dan id_receiver merujuk ke akun_pengguna)
            $table->foreign('id_sender')->references('id_user')->on('akun_pengguna')->onDelete('cascade');
            $table->foreign('id_receiver')->references('id_user')->on('akun_pengguna')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            $table->dropForeign(['id_sender']);
            $table->dropForeign(['id_receiver']);
            $table->dropColumn(['id_sender', 'id_receiver']);
        });
    }
};
