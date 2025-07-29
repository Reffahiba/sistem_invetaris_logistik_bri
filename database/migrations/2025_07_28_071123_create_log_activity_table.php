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
        Schema::create('log_activity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user') // ID pengguna yang melakukan aktivitas
                    ->nullable()
                    ->constrained(
                        table: 'akun_pengguna', column: 'id_user' // 
                    )
                    ->onDelete('set null');
            $table->string('activity'); // Contoh: "menambahkan", "mengedit", "menghapus"
            $table->string('description'); // Contoh: "Menambahkan barang baru 'Laptop ASUS'"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_activity');
    }
};
