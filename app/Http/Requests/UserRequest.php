<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'email' => 'required|email',
        ];
        if (strpos($this->path(), 'register') !== false) {
            array_push($rules, [
                'username' => 'required|between:3,25|regex:/^[A-Za-z0-9\-\_\p{Han}]+$/u|unique:users,name,'. Auth::id(),
                'service' => 'required|true'
            ]);
        }
        return $rules;
    }
}
