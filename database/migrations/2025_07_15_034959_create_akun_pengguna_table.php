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
        Schema::create('akun_pengguna', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('nama_user')->unique();
            $table->string('email')->unique();
            $table->string('nomor_telepon', 15);
            $table->string('password');
            $table->unsignedBigInteger('id_divisi');
            $table->unsignedBigInteger('id_role');
            $table->foreign('id_divisi')->references('id_divisi')->on('divisi')->onDelete('cascade');
            $table->foreign('id_role')->references('id_role')->on('role')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('akun_pengguna');
    }
};
