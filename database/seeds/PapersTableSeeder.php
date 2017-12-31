<?php

use Illuminate\Database\Seeder;
use App\Models\Paper;

class PapersTableSeeder extends Seeder
{
    public function run()
    {
        $papers = factory(Paper::class)->times(50)->make()->each(function ($paper, $index) {
            if ($index == 0) {
                // $paper->field = 'value';
            }
        });

        Paper::insert($papers->toArray());
    }

}

