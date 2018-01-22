<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'namespace' => 'Api',
    'prefix' => 'auth',
], function ($router) {
    $router->post('login', 'AuthController@login');
    $router->get('logout', 'AuthController@logout');
    $router->post('refresh', 'AuthController@refresh');
    $router->get('me', 'AuthController@me');
    $router->post('register', 'AuthController@register');

});

Route::group([
    'middleware' => 'api',
    'prefix' => 'papers',
], function ($router) {
    $router->get('my', 'PapersController@myPapers');
    $router->get('/{paper}/status', 'PapersController@status');
    $router->get('/{paper}/edit', 'PapersController@edit');
    $router->post('/{paper}/update', 'PapersController@update');
    $router->get('/{paper}/remove', 'PapersController@destroy');
    $router->post('/store', 'PapersController@store');
    $router->post('/submit/{score}', 'ScoresController@submit');
    $router->post('/{paper}/start', 'ScoresController@startTest');
    $router->get('/myscores', 'ScoresController@myScores');
    $router->post('/autoSave', 'ScoresController@autoSave');
    $router->get('/{paper}/check', 'ScoresController@checkTestStatus');
});


Route::get('/scores/{score}/remove', 'PapersController@removeScore');