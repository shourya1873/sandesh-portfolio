<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactEmail;
use Illuminate\Support\Facades\Mail;
class ContactForm extends Controller
{

    public function send(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'message' => 'required|string',
                'subject' => 'required|string',
                'phone' => 'required|string',
            ]);
            Mail::to(env('MAIL_TO_ADDRESS'))->send(new ContactEmail($validated));

            return response()->json(['message' => 'Message sent successfully.'], 200);
        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
