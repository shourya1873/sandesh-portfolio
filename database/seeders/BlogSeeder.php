<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 30; $i++) {
            Blog::create([
                'blog_title' => 'Blog Post ' . $i,
                'content' => Str::random(200), // You can replace with faker if needed
                'featured_image' => 'http://sandesh-portfolio.test/storage/uploads/posts/mN1p1AJkhe5WyDPuxPrz52mqxCULmhWYGkCelSD0.png',
            ]);
        }
    }
}
