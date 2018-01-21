<?php

use App\Models\Score;
use Illuminate\Database\Seeder;
use App\Models\Paper;

class ScoresTableSeeder extends Seeder
{
    public function run()
    {
        $scores = factory(Score::class)->times(500)->make();

        Score::insert($scores->toArray());
    }

}