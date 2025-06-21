<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $cart = $request->user()->cart()->with('product')->get();

        if ($cart->isEmpty()) {
            return response()->json([
                'error' => 'Cart is empty.'
            ], 400);
        }

        $total = 0;
        foreach ($cart as $item) {
            if (!$item->product->is_active) {
                return response()->json([
                    'error' => "Product {$item->product->name} is not available."
                ], 400);
            }

            if ($item->product->quantity < $item->quantity) {
                return response()->json([
                    'error' => "Insufficient quantity for {$item->product->name}."
                ], 400);
            }

            $total += $item->product->price * $item->quantity;
        }

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'total' => $total,
            'status' => 'pending',
            'notes' => $request->notes
        ]);

        // Clear cart after order creation
        $request->user()->cart()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully.',
            'order' => $order
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()->find($id);

        if (!$order) {
            return response()->json([
                'error' => 'Order not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $order = $request->user()->orders()->find($id);

        if (!$order) {
            return response()->json([
                'error' => 'Order not found.'
            ], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'error' => 'Order cannot be cancelled.'
            ], 400);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully.',
            'order' => $order
        ]);
    }
} 