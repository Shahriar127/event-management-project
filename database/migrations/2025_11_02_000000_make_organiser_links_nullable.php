<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            // Postgres: drop NOT NULL constraint
            DB::statement("ALTER TABLE organisers ALTER COLUMN facebook_link DROP NOT NULL;");
            DB::statement("ALTER TABLE organisers ALTER COLUMN description DROP NOT NULL;");
        } elseif ($driver === 'mysql' || $driver === 'mariadb') {
            // MySQL: modify column to allow nulls (assume varchar(255) used in migration)
            DB::statement("ALTER TABLE organisers MODIFY facebook_link varchar(255) NULL;");
            DB::statement("ALTER TABLE organisers MODIFY description varchar(255) NULL;");
        } else {
            // Fallback: try using schema change (requires doctrine/dbal)
            Schema::table('organisers', function (Blueprint $table) {
                $table->string('facebook_link')->nullable()->change();
                $table->string('description')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE organisers ALTER COLUMN facebook_link SET NOT NULL;");
            DB::statement("ALTER TABLE organisers ALTER COLUMN description SET NOT NULL;");
        } elseif ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE organisers MODIFY facebook_link varchar(255) NOT NULL;");
            DB::statement("ALTER TABLE organisers MODIFY description varchar(255) NOT NULL;");
        } else {
            Schema::table('organisers', function (Blueprint $table) {
                $table->string('facebook_link')->nullable(false)->change();
                $table->string('description')->nullable(false)->change();
            });
        }
    }
};
