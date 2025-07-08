<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    // Status constants
    const STATUS_APPROVED = 1;    // Duyệt
    const STATUS_PENDING = 0;     // Đang chờ
    const STATUS_REJECTED = -1;   // Không duyệt

    protected $fillable = [
        'user_id',
        'product_id',
        'title',
        'comment',
        'rating',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Scope methods for status
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    // Helper methods
    public function isApproved()
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isRejected()
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isActive()
    {
        return $this->status === self::STATUS_APPROVED;
    }
} 