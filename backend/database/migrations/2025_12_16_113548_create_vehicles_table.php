<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignId('model_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->text('description');

            $table->year('year');
            $table->integer('mileage');
            $table->integer('engine_capacity')->nullable();
            $table->integer('power')->nullable();

            $table->enum('fuel', ['petrol', 'diesel', 'electric', 'hybrid', 'lpg']);
            $table->enum('transmission', ['manual', 'automatic']);
            $table->enum('drive', ['fwd', 'rwd', 'awd'])->nullable();

            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('EUR');
            $table->string('location');

            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();

            $table->index(['brand_id', 'model_id']);
            $table->index('price');
            $table->index('year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
