<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganiserRequest extends FormRequest
{
    public function rules()
    {
        return [
            // organiser_id is stored server-side (or can be optional). Do not require it here.
            'organiser_name' => ['required', 'string', 'max:255'],
            'organiser_email' => ['required', 'email', 'max:254'],
            'description' => ['nullable', 'string'],
            'facebook_link' => ['nullable', 'url', 'max:255'],
            // twitter_link removed
            // Logo upload: optional, must be an image if present, limit to 2MB
            'logo' => ['nullable', 'file', 'image', 'max:2048'],
        ];
    }

    public function authorize()
    {
        return true;
    }
}
