<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

function genPaperContent(Faker $faker, $count = 20)
{
    $content = [];
    for ($i = 0; $i < $count; $i++) {
        $item = [];
        $item['question'] = $faker->sentence();
        $item['type'] = $faker->randomElement(['single', 'multi']);
        if ($item['type'] == 'single' || $item['type'] == 'multi') {
            $options = [];
            for ($j = 0; $j < 4; $j++) {
                array_push($options, $faker->sentence());
            }
            $item['options'] = $options;
        }
        $item['score'] = 5;
        array_push($content, $item);
    }
    return $content;
}

function genAnswers(Faker $faker, $content, $rightAnswers = null)
{
    $result = [];
    foreach ($content as $index => $item) {
        $item = (object)$item;
        if ($rightAnswers && $faker->boolean(60)) {
            array_push($result, $rightAnswers[$index]);
        } else {
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
