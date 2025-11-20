<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganiserRequest extends FormRequest
{
    public function rules()
    {
        return [

            'organiser_name' => ['required', 'string', 'max:255'],
            'organiser_email' => ['required', 'email', 'max:254'],
            'description' => ['nullable', 'string'],
            'facebook_link' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'file', 'image', 'max:2048'],
        ];
    }

    public function authorize()
    {
        return true;
    }
}
