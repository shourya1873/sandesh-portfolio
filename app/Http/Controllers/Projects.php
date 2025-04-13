<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class Projects extends Controller
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

        $projects = \App\Models\Project::where('is_active', true)->latest()->paginate(10, ['*'], 'p', $pageNumber);
        return Inertia::render('projects', [
            'projects' => $projects
        ]);
    }
}
