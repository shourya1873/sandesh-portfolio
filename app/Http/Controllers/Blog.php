<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class Blog extends Controller
{

    public function index($urlKey)
    {
        $post = \App\Models\Blog::where('url_key', $urlKey)->firstOrFail();
        return Inertia::render('blog', [
            'post' => $post
        ]);
    }
}
