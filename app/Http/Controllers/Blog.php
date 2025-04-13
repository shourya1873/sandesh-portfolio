<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class Blog extends Controller
{

    public function index($urlKey)
    {
        $post = \App\Models\Blog::where('url_key', $urlKey)
            ->where('is_active', true)
            ->firstOrFail();
        return Inertia::render('blog', [
            'post' => $post
        ]);
    }
}
