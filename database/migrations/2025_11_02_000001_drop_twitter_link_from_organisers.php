<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql' || $driver === 'mysql' || $driver === 'mariadb') {
            DB::statement('ALTER TABLE organisers DROP COLUMN IF EXISTS twitter_link;');
        } else {
            Schema::table('organisers', function (Blueprint $table) {
                if (Schema::hasColumn('organisers', 'twitter_link')) {
                    $table->dropColumn('twitter_link');
                }
            });
        }
    }

    public function down(): void
    {
        // Recreate twitter_link as nullable string when rolling back
        Schema::table('organisers', function (Blueprint $table) {
            if (! Schema::hasColumn('organisers', 'twitter_link')) {
                $table->string('twitter_link')->nullable();
            }
        });
    }
};
