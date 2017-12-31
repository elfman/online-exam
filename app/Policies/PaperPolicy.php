<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Paper;

class PaperPolicy extends Policy
{
    public function update(User $user, Paper $paper)
    {
        return $paper->creator_id == $user->id;
    }

    public function destroy(User $user, Paper $paper)
    {
        return $paper->creator_id == $user->id;
    }
}
