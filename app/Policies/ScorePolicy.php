<?php

namespace App\Policies;

use App\Models\Paper;
use App\Models\User;
use App\Models\Score;
use Illuminate\Auth\Access\HandlesAuthorization;

class ScorePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the score.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Score  $score
     * @return mixed
     */
    public function view(User $user, Score $score)
    {
        //
    }

    /**
     * Determine whether the user can create scores.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the score.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Score  $score
     * @return mixed
     */
    public function update(User $user, Score $score)
    {
        return $score->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the score.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Score  $score
     * @return mixed
     */
    public function delete(User $user, Score $score)
    {
        $paper = Paper::find($score->paper_id);
        return $paper->creator_id === $user->id;
    }
}
