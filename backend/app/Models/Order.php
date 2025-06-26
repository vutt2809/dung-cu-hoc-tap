<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'total',
        'status',
        'notes',
        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'shipping_note',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Nếu có quan hệ với order_items hoặc cart_items thì bổ sung ở đây
} 