<?php
/**
 * Created by PhpStorm.
 * User: luoxiongwen
 * Date: 2017/12/13
 * Time: 下午1:25
 */
return [
    'github' => [
        'client_id' => env('GITHUB_KEY'),
        'client_secret' => env('GITHUB_SECRET'),
        'redirect' => env('APP_URL') . '/oauth/github/callback',
    ],
];
