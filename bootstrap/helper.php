<?php

function route_class()
{
    return str_replace(':', '-', Route::currentRouteName());
}

function computeScore($answers, $paper) {
    $paperAnswers = json_decode($paper->answers);
    $content = json_decode($paper->content);
    if (count($answers) != count($paperAnswers)) {
        return -1;
    }
    $score = 0;
    for ($index = 0; $index < count($paperAnswers); $index++) {
        $rightAnswer = $paperAnswers[$index];
        $question = $content[$index];
        $answer = $answers[$index];
        if ($question->type === 'single') {
            if ($rightAnswer === $answer) {
                $score += $question->score;
            }
        } else if ($question->type === 'multi') {
            if (count($answer) === count($rightAnswer) &&
                count(array_diff($rightAnswer, $answer)) === 0) {
                $score += $question->score;
            }
        }
    }
    return $score;
}