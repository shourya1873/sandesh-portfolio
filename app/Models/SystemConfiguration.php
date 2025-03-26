<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class SystemConfiguration extends Model
{
    protected $fillable = ['key', 'value'];

    public static function getValue(string $key, $default = null): ?string
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    protected function value(): Attribute
    {
        return Attribute::make(
            get: fn ($v) => decrypt($v),
            set: fn ($v) => encrypt($v),
        );
    }
}
