<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Project extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['name', 'short_description', 'featured_image', 'project_url', 'url_key', 'project_media','content','is_active'];

    protected $casts = [
        'project_media' => 'array',
    ];
    //
}
