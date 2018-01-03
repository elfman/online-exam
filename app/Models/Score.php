<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Score extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'paper_id', 'answers', 'score', 'start_time', 'complete_time'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function setAnswersAttribute($value)
    {
        if (!is_string($value)) {
            $value = json_encode($value, true);
        }
        $this->attributes['answers'] = $value;
    }
}