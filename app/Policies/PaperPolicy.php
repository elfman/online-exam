<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Paper;
use Log;

class PaperPolicy extends Policy
{
    public function update(User $user, Paper $paper)
    {
        Log::info($user->id . ' ' . $paper->id);
        return $paper->creator_id == $user->id;
    }

    public function destroy(User $user, Paper $paper)
    {
        return $paper->creator_id == $user->id;
    }
}
