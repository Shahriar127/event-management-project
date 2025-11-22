<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'Title' => ['required', 'string', 'max:255'],
            'Description' => ['required', 'string'],
            'StartDate' => ['required', 'date'],
            'EndDate' => ['nullable', 'date', 'after_or_equal:StartDate'],
            'ImageUrl' => ['nullable', 'file', 'image', 'max:5120'],
            'VenueName' => ['required', 'string'],
            'AddressLine1' => ['required', 'string'],
            'AddressLine2' => ['nullable', 'string'],
            'City' => ['required', 'string'],
            'PostCode' => ['required', 'string'],
            'Currency' => ['required', 'string'],
            'EventVisibility' => ['nullable', 'string'],
            // Social links removed for Event model
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
