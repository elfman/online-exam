<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

function genAnswers(Faker $faker, $content)
{
    $result = [];
    foreach ($content as $index => $item) {
        $item = (object)$item;
        if ($item->type == 'single') {
            $answer = $faker->numberBetween(0, count($item->options) - 1);
            array_push($result, $answer);
        } else if ($item->type == 'multi') {
            $count = count($item->options);
            $list = [];
            $answer = $faker->numberBetween(1, pow(2, $count) - 1);
            for ($i = 0; $i < $count; $i++) {
                $temp = $answer & 1;
                if ($temp) {
                    array_push($list, $i);
                }
                $answer = $answer >> 1;
            }
            array_push($result, $list);
        }
    }
    return $result;
}

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
		$this->call(PapersTableSeeder::class);
		$this->call(ScoresTableSeeder::class);
    }
}
