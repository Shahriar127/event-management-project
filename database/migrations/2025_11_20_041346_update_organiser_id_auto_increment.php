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
        Schema::table('organisers', function (Blueprint $table) {
            // Make organiser_id auto-incrementing primary key
            $table->increments('organiser_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organisers', function (Blueprint $table) {
            $table->integer('organiser_id')->change();
        });
    }
};
