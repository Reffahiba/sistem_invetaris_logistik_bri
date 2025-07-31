<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id('id_transaksi');
            $table->foreignId('id_user')->constrained(table: 'akun_pengguna', column: 'id_user')->onDelete('cascade');
            $table->string('pesan'); 
            $table->string('link')->nullable(); 
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};
