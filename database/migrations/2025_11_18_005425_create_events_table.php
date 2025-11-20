<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('Description');
            $table->date('StartDate');
            $table->string('ImageUrl');
            $table->string('VenueName');
            $table->string('AddressLine1');
            $table->string('AddressLine2');
            $table->string('City');
            $table->string('PostCode');
            $table->string('Currency');
            $table->string('EventVisibility');
            $table->string('FacebookLink');
            $table->string('LinkedInLink');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
