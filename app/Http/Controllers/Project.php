<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class Project extends Controller
{
    public function index($urlKey)
    {
        $project = \App\Models\Project::where('url_key', $urlKey)->where('is_active', true)->firstOrFail();
        return Inertia::render('project', [
            'project' => $project
        ]);
    }
}
