<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::table('fuels')->insert([
            ['code' => 'petrol', 'label' => 'Benzin'],
            ['code' => 'diesel', 'label' => 'Nafta'],
            ['code' => 'electric', 'label' => 'Elektrina'],
            ['code' => 'hybrid', 'label' => 'Hybrid'],
            ['code' => 'lpg', 'label' => 'LPG'],
        ]);

        DB::table('transmissions')->insert([
            ['code' => 'manual', 'label' => 'Manualna'],
            ['code' => 'automatic', 'label' => 'Automaticka'],
        ]);

        DB::table('drives')->insert([
            ['code' => 'fwd', 'label' => 'FWD'],
            ['code' => 'rwd', 'label' => 'RWD'],
            ['code' => 'awd', 'label' => 'AWD'],
        ]);

        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('fuel_id')->nullable()->after('power');
            $table->unsignedBigInteger('transmission_id')->nullable()->after('fuel_id');
            $table->unsignedBigInteger('drive_id')->nullable()->after('transmission_id');
        });

        DB::statement(
            'UPDATE vehicles v JOIN fuels f ON v.fuel = f.code SET v.fuel_id = f.id'
        );
        DB::statement(
            'UPDATE vehicles v JOIN transmissions t ON v.transmission = t.code SET v.transmission_id = t.id'
        );
        DB::statement(
            'UPDATE vehicles v LEFT JOIN drives d ON v.drive = d.code SET v.drive_id = d.id'
        );

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['fuel', 'transmission', 'drive']);
        });

        DB::statement('ALTER TABLE vehicles CHANGE fuel_id fuel BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE vehicles CHANGE transmission_id transmission BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE vehicles CHANGE drive_id drive BIGINT UNSIGNED NULL');

        Schema::table('vehicles', function (Blueprint $table) {
            $table->foreign('fuel')->references('id')->on('fuels');
            $table->foreign('transmission')->references('id')->on('transmissions');
            $table->foreign('drive')->references('id')->on('drives');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign(['fuel']);
            $table->dropForeign(['transmission']);
            $table->dropForeign(['drive']);
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->enum('fuel_tmp', ['petrol', 'diesel', 'electric', 'hybrid', 'lpg'])->nullable();
            $table->enum('transmission_tmp', ['manual', 'automatic'])->nullable();
            $table->enum('drive_tmp', ['fwd', 'rwd', 'awd'])->nullable();
        });

        DB::statement(
            'UPDATE vehicles v JOIN fuels f ON v.fuel = f.id SET v.fuel_tmp = f.code'
        );
        DB::statement(
            'UPDATE vehicles v JOIN transmissions t ON v.transmission = t.id SET v.transmission_tmp = t.code'
        );
        DB::statement(
            'UPDATE vehicles v LEFT JOIN drives d ON v.drive = d.id SET v.drive_tmp = d.code'
        );

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['fuel', 'transmission', 'drive']);
        });

        DB::statement('ALTER TABLE vehicles CHANGE fuel_tmp fuel ENUM("petrol","diesel","electric","hybrid","lpg") NOT NULL');
        DB::statement('ALTER TABLE vehicles CHANGE transmission_tmp transmission ENUM("manual","automatic") NOT NULL');
        DB::statement('ALTER TABLE vehicles CHANGE drive_tmp drive ENUM("fwd","rwd","awd") NULL');

        Schema::dropIfExists('drives');
        Schema::dropIfExists('transmissions');
        Schema::dropIfExists('fuels');
    }
};
