<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('organisers', function (Blueprint $table) {
            $table->id();
            $table->integer('organiser_id');
            $table->string('organiser_name');
            $table->string('organiser_email');
            $table->string('description');
            $table->string('facebook_link');
            $table->string('logo');
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('user_id')->constrained();
        });
    }

    public function down()
    {
        Schema::dropIfExists('organisers');
    }
};
