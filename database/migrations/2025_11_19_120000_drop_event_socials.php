<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration {
    public function up(): void
    {
        // Drop the FacebookLink and LinkedInLink columns from events if they exist.
        $driver = config('database.default');

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE "events" DROP COLUMN IF EXISTS "FacebookLink";');
            DB::statement('ALTER TABLE "events" DROP COLUMN IF EXISTS "LinkedInLink";');
        } else {
            // MySQL / MariaDB / SQLite fallback
            Schema::table('events', function (Blueprint $table) {
                if (Schema::hasColumn('events', 'FacebookLink')) {
                    $table->dropColumn('FacebookLink');
                }
                if (Schema::hasColumn('events', 'LinkedInLink')) {
                    $table->dropColumn('LinkedInLink');
                }
            });
        }
    }

    public function down(): void
    {
        // Add the columns back as nullable strings (safe rollback)
        Schema::table('events', function (Blueprint $table) {
            if (! Schema::hasColumn('events', 'FacebookLink')) {
                $table->string('FacebookLink')->nullable();
            }
            if (! Schema::hasColumn('events', 'LinkedInLink')) {
                $table->string('LinkedInLink')->nullable();
            }
        });
    }
};
