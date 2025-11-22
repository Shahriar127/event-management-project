<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:high,mid,low'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Convert empty-string quantities to null so 'nullable|integer' validation passes and
        // the DB can interpret null as "unlimited".
        if ($this->has('quantity') && $this->input('quantity') === '') {
            $this->merge(['quantity' => null]);
        }
    }
}
