<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', 'HomeController@index')->name('root');

Route::get('/oauth/github', 'AuthController@redirectToProvider')->name('oauth.github.redirect');
Route::get('/oauth/github/callback', 'AuthController@handleProviderCallback')->name('oauth.github.callback');

Route::resource('papers', 'PapersController', ['only' => ['index', 'show', 'create', 'store', 'update', 'edit', 'destroy']]);