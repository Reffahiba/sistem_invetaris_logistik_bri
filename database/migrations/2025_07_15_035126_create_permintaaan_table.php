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
        Schema::create('permintaan', function (Blueprint $table) {
            $table->id('id_permintaan');
            $table->date('tanggal_minta');
            $table->enum('status', ['menunggu', 'sedang diproses', 'sedang diantar', 'telah diterima'])->default('menunggu');
            $table->unsignedBigInteger('id_user');
            $table->foreign('id_user')->references('id_user')->on('akun_pengguna')->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permintaaan');
    }
};
