<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $now = now();
        DB::table('features')->insert([
            ['name' => 'tempomat', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'adaptivny tempomat', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'stresne okno', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'klimatizacia', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'automaticka klimatizacia', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'parkovacie senzory', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'parkovacia kamera', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'navigacia', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'bluetooth', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'android auto', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'apple carplay', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'vyhrievane sedadla', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'kozeny interier', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'led svetla', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'xenonove svetla', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'elektricke okna', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'elektricke spatne zrkadla', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'asistent rozjazdu do kopca', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'sledovanie mrtveho uhla', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'bezklicove startovanie', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'head-up displej', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'tazne zariadenie', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        DB::table('features')
            ->whereIn('name', [
                'tempomat',
                'adaptivny tempomat',
                'stresne okno',
                'klimatizacia',
                'automaticka klimatizacia',
                'parkovacie senzory',
                'parkovacia kamera',
                'navigacia',
                'bluetooth',
                'android auto',
                'apple carplay',
                'vyhrievane sedadla',
                'kozeny interier',
                'led svetla',
                'xenonove svetla',
                'elektricke okna',
                'elektricke spatne zrkadla',
                'asistent rozjazdu do kopca',
                'sledovanie mrtveho uhla',
                'bezklicove startovanie',
                'head-up displej',
                'tazne zariadenie',
            ])
            ->delete();
    }
};
