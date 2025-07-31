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
        Schema::table('permintaan', function (Blueprint $table) {
            $table->enum('status', ['menunggu', 'sedang diproses', 'sedang diantar', 'telah diterima', 'ditolak'])
                    ->default('menunggu')
                    ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permintaan', function (Blueprint $table) {
            $table->enum('status', ['menunggu', 'sedang diproses', 'sedang diantar', 'telah diterima'])
                    ->default('menunggu')
                    ->change();
        });
    }
};
