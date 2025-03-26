<?php

use App\Http\Controllers\Blog;
use App\Http\Controllers\Blogs;
use App\Http\Controllers\ContactForm;
use App\Http\Controllers\Project;
use App\Http\Controllers\Projects;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/blogs', [Blogs::class, 'index'])->name('blogs');
Route::get('/blog/{url_key}', [Blog::class, 'index'])->name('blog');
Route::post('/contact', [ContactForm::class, 'send']);

Route::get('/projects', [Projects::class, 'index'])->name('projects');
Route::get('/project/{url_key}', [Project::class, 'index'])->name('project');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
