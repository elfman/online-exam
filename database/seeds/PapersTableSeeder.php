<?php

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Paper;

class PapersTableSeeder extends Seeder
{
    public function run()
    {
        static $users;

        $faker = app(\Faker\Generator::class);
        $users = $users ?: User::all()->pluck('id')->toArray();
        $papers = factory(Paper::class)->times(50)->make();

        Paper::insert($papers->toArray());
    }

}

