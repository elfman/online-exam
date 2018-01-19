<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
	{
		\App\Models\User::observe(\App\Observers\UserObserver::class);
		\App\Models\Paper::observe(\App\Observers\PaperObserver::class);

		\Carbon\Carbon::setLocale('zh');

		\Validator::extend('same_length', function($attribute, $value, $params) {
		    \Log::info($params);
		    if(sizeof(request()->get($params[0])) !== sizeof($value)) {
		        return false;
            }
        });
		\Validator::extend('type_match', function($attribute, $answers, $params) {
		    $questions = request()->get($params[0]);
		    foreach ($questions as $index => $question) {
		        if ($question['type'] === 'single') {
		            if (gettype($answers[$index] !== 'boolean')) {
		                return false;
                    }
                } else if ($question['type'] === 'multi') {
		            if (gettype($answers[$index] !== 'array')) {
		                return false;
                    }
                } else {
		            return false;
                }
            }
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
