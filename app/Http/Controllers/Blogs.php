<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Inertia\Inertia;
use Illuminate\Http\Request;

class Blogs extends Controller
{
    private Request $request;

    /**
     * @param Request $request
     */
    public function __construct(
        Request $request,
    ) {
        $this->request = $request;
    }

    public function index()
    {
        $pageNumber = $this->request->query('p') ?? 1;

        $posts = Blog::latest()->paginate(10, ['*'], 'p', $pageNumber);
        return Inertia::render('blogs', [
            'posts' => $posts
        ]);
    }
}
