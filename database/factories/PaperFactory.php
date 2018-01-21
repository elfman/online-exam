<?php

use App\Models\User;
use Faker\Generator as Faker;



$factory->define(App\Models\Paper::class, function (Faker $faker) {
    static $users;

    $users = $users ?: User::all()->pluck('id')->toArray();

    $updated_at = $faker->dateTimeThisMonth();
    $created_at = $faker->dateTimeThisMonth($updated_at);

    $content = genPaperContent($faker);
    $answers = genAnswers($faker, $content);

    return [
        'title' => $faker->sentence(),
        'content' => json_encode($content),
        'answers' => json_encode($answers),
        'creator_id' => $faker->randomElement($users),
        'created_at' => $created_at,
        'updated_at' => $updated_at,
        'password' => $faker->boolean() ? $faker->password(3, 6) : null,
        'open_time' => $faker->boolean() ? $faker->dateTimeBetween('now', '2 months') : null,
        'repeat_limit' => $faker->boolean() ? $faker->randomNumber(5) : 1,
    ];
});


