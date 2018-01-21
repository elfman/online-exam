<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Paper extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'creator_id', 'total_score', 'content', 'time_limit', 'participation_count', 'answers', 'password', 'open_time', 'repeat_limit'];

//    protected $appends = ['questions'];

    public function creator()
    {
        return $this->belongsTo(User::class);
    }

    public function setContentAttribute($value)
    {
        if (!is_string($value)) {
            $value = json_encode($value);
        }
        $this->attributes['content'] = $value;
    }

    public function setAnswersAttribute($value)
    {
        if (!is_string($value)) {
            $value = json_encode($value);
        }
        $this->attributes['answers'] = $value;
    }

//    public function getQuestionsAttribute()
//    {
//        if ($this->attributes['content'] === null) {
//            return null;
//        }
//        return json_decode($this->attributes['content']);
//    }

}
