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
        Schema::table('barang_masuk', function (Blueprint $table) {
            // Tambahkan baris ini
            $table->string('kode_transaksi')->unique()->after('id_transaksi'); // ->after() bersifat opsional
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang_masuk', function (Blueprint $table) {
            // Tambahkan baris ini untuk bisa di-rollback
            $table->dropColumn('kode_transaksi');
        });
    }
};