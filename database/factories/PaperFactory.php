<?php

use App\Models\User;
use Faker\Generator as Faker;

function genPaperContent(Faker $faker, $count = 20)
{
    $content = [];
    for ($i = 0; $i < $count; $i++) {
        $item = [];
        $item['question'] = $faker->sentence();
        $item['type'] = $faker->randomElement(['single', 'multi', 'filling']);
        if ($item['type'] == 'single' || $item['type'] == 'multi') {
            $options = [];
            for ($j = 0; $j < 4; $j++) {
                $options[$j] = $faker->sentence();
            }
            $item['options'] = $options;
        }
        $item['score'] = 5;
        array_push($content, $item);
    }
    return $content;
}

$factory->define(App\Models\Paper::class, function (Faker $faker) {
    static $users;

    $users = $users ?: User::all()->pluck('id')->toArray();

    $updated_at = $faker->dateTimeThisMonth();
    $created_at = $faker->dateTimeThisMonth($updated_at);

    return [
        'title' => $faker->sentence(),
        'content' => genPaperContent($faker),
        'creator_id' => $faker->randomElement($users),
        'created_at' => $created_at,
        'updated_at' => $updated_at,
    ];
});


