<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Blog extends Model implements HasMedia
{

    use InteractsWithMedia;

    protected $fillable = ['blog_title', 'content', 'featured_image', 'tags', 'url_key', 'is_active'];

    protected $casts = [
        'tags' => 'array',
    ];
    //
}
