<?php

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $users = factory(User::class)
            ->times(10)
            ->make()
            ->each(function ($user, $i) {
            if ($i == 0) {
                $user->name = 'Harlan';
                $user->email = 'luoxwen@gmail.com';
            }
        });

        $user_array = $users->makeVisible(['password', 'remember_token'])->toArray();

        User::insert($user_array);
    }
}