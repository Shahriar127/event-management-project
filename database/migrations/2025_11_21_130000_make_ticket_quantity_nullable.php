<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Make the tickets.quantity column nullable so the UI can leave it blank to mean "unlimited".
        Schema::table('tickets', function (Blueprint $table) {
            // Note: change() requires the doctrine/dbal package. If not installed, run:
            // composer require doctrine/dbal
            $table->integer('quantity')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->integer('quantity')->default(0)->change();
        });
    }
};
