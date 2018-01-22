<?php

use App\Models\Score;
use Illuminate\Database\Seeder;
use App\Models\Paper;

class ScoresTableSeeder extends Seeder
{
    public function run()
    {
        $scores = factory(Score::class)->times(5000)->make();

        Score::insert($scores->toArray());

        \DB::update('UPDATE papers, (SELECT paper_id, count(paper_id) as number FROM scores group by paper_id) as c SET papers.`participation_count`=c.number WHERE papers.id=c.paper_id;');
    }

}