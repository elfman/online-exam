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
    $router->post('/{paper}/start', 'PapersController@startTest');
    $router->get('/{paper}/edit', 'PapersController@edit');
    $router->post('/{paper}/update', 'PapersController@update');
    $router->get('/{paper}/remove', 'PapersController@destroy');
    $router->post('/store', 'PapersController@store');
    $router->post('/submit/{score}', 'PapersController@submit');
    $router->get('/myscores', 'PapersController@myScores');
    $router->post('/autoSave', 'PapersController@autoSave');
    $router->get('/{paper}/check', 'PapersController@checkTestStatus');
    $router->get('/{paper}/status', 'PapersController@status');
});


Route::get('/scores/{score}/remove', 'PapersController@removeScore');