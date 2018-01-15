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
    $router->post('logout', 'AuthController@logout');
    $router->post('refresh', 'AuthController@refresh');
    $router->post('me', 'AuthController@me');
    $router->post('register', 'AuthController@register');

});

Route::group([
    'middleware' => 'api',
    'prefix' => 'papers',
], function ($router) {
    $router->get('my', 'PapersController@myPapers');
    $router->get('/{paper}/start', 'PapersController@startTest');
    $router->get('/{paper}/edit', 'PapersController@edit');
    $router->post('/{paper}/update', 'PapersController@update');
    $router->get('/{paper}/remove', 'PapersController@destroy');
    $router->post('/store', 'PapersController@store');
    $router->post('/submit', 'PapersController@submit');
});
