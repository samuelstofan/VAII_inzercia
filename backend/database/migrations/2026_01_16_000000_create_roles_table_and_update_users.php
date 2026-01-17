<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('code')->unique();
            $table->string('label');
            $table->timestamps();
        });

        $now = now();
        DB::table('roles')->insert([
            ['id' => 1, 'code' => 'user', 'label' => 'User', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'code' => 'admin', 'label' => 'Admin', 'created_at' => $now, 'updated_at' => $now],
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedTinyInteger('role_id')->default(1)->after('is_seller');
        });

        DB::table('users')
            ->where('role', 'admin')
            ->update(['role_id' => 2]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('roles');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('is_seller');
        });

        DB::table('users')
            ->where('role_id', 2)
            ->update(['role' => 'admin']);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role_id');
        });

        Schema::dropIfExists('roles');
    }
};
