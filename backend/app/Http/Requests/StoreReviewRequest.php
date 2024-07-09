<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ride_id' => 'required|exists:ride_posts,id',
            'reviewee_id' => 'required|exists:users,id|different:reviewer_id',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'reviewer_id' => Auth::id(),
        ]);
    }
}
