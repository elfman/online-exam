<?php

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $users = factory(User::class)
            ->times(10)
            ->make();

        $user_array = $users->makeVisible(['password', 'remember_token'])->toArray();

        User::insert($user_array);

        $user = User::find(1);
        $user->name = 'Harlan';
        $user->email = 'luoxwen@gmail.com';
        $user->github_id = 948001;
        $user->avatar = 'https://avatars0.githubusercontent.com/u/948001?v=4';
        $user->save();
    }
}