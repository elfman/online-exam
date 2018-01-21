<?php

use App\Models\Paper;
use App\Models\Score;
use App\Models\User;
use Faker\Generator as Faker;

$factory->define(Score::class, function (Faker $faker) {
    static $users;
    static $papers;

    $users = $users ?: User::all()->pluck('id')->toArray();
    $papers = $papers ?: Paper::all()->pluck('id')->toArray();

    $paper = Paper::find($faker->randomElement($papers));
    $answers = genAnswers($faker, json_decode($paper->content));
    $score = computeScore($answers, $paper);
    $startTime = $faker->dateTime($paper->created_at);
    $completeTime = Carbon\Carbon::instance($startTime)->addMinute($paper->time_limit - $faker->numberBetween(10, $paper->time_limit));
    return [
        'user_id' => $faker->randomElement($users),
        'paper_id' => $paper->id,
        'answers' => $answers,
        'score' => $score,
        'start_time' => $startTime,
        'complete_time' => $completeTime,
        'created_at' => $startTime,
        'updated_at' => $startTime,
    ];
});