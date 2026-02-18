<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'slug',
        'image_url',
        'image_key',
        'description',
        'quantity',
        'price',
        'taxable',
        'is_active',
        'brand_id',
        'category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'taxable' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Trả về URL ảnh: ưu tiên image_url, nếu không có thì build từ image_key (client load từ backend).
     */
    public function getImageUrlAttribute($value)
    {
        if ($value) {
            return $value;
        }
        if ($this->attributes['image_key'] ?? null) {
            return rtrim(config('app.url'), '/') . '/storage/' . $this->attributes['image_key'];
        }
        return null;
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
} 