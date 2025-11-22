<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration {
    public function up(): void
    {
        $driver = config('database.default');

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE "organisers" DROP COLUMN IF EXISTS "organiser_id";');
        } else {
            Schema::table('organisers', function (Blueprint $table) {
                if (Schema::hasColumn('organisers', 'organiser_id')) {
                    $table->dropColumn('organiser_id');
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('organisers', function (Blueprint $table) {
            if (! Schema::hasColumn('organisers', 'organiser_id')) {
                $table->integer('organiser_id')->nullable();
            }
        });
    }
};
