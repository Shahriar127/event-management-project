<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Add organiser_id foreign key referencing organisers.id
            $table->foreignId('organiser_id')->nullable()->constrained('organisers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['organiser_id']);
            $table->dropColumn('organiser_id');
        });
    }
};
