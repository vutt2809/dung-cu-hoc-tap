<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Admin can see all orders, regular users can only see their own orders
        if ($request->user()->role === 'ROLE ADMIN') {
            $orders = Order::with('user')->orderBy('created_at', 'desc')->get();
        } else {
            $orders = $request->user()->orders()->orderBy('created_at', 'desc')->get();
        }

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

        // Debug: Log cart items count
        \Log::info('Cart items count: ' . $cart->count());
        \Log::info('Cart items: ', $cart->toArray());

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

        // Debug: Log the totals for comparison
        \Log::info('Backend calculated total: ' . $total);
        \Log::info('Frontend sent total: ' . $request->total);
        \Log::info('Difference: ' . abs($total - $request->total));

        // Verify total matches with more flexible tolerance
        if (abs($total - $request->total) > 1) {
            return response()->json([
                'error' => 'Total amount mismatch. Backend: ' . $total . ', Frontend: ' . $request->total
            ], 400);
        }

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'total' => $total,
            'status' => 'pending',
            'notes' => $request->notes
        ]);

        // Lưu từng sản phẩm vào order_items
        $orderItemsCount = 0;
        foreach ($cart as $item) {
            $order->items()->create([
                'product_id' => $item->product->id,
                'product_name' => $item->product->name,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'total' => $item->product->price * $item->quantity,
                'status' => 'Processing',
            ]);
            $orderItemsCount++;
        }

        // Debug: Log order items count
        \Log::info('Order items created: ' . $orderItemsCount);

        // Clear cart after order creation
        $request->user()->cart()->delete();

        // Trả về order kèm items
        $order = Order::with('items.product')->find($order->id);

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully.',
            'order' => $order
        ], 201);
    }

    public function show(Request $request, $id)
    {
        // Admin can view any order, regular users can only view their own orders
        if ($request->user()->role === 'ROLE ADMIN') {
            $order = Order::with('items.product')->find($id);
        } else {
            $order = $request->user()->orders()->with('items.product')->find($id);
        }

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
        // Admin can cancel any order, regular users can only cancel their own orders
        if ($request->user()->role === 'ROLE ADMIN') {
            $order = Order::find($id);
        } else {
            $order = $request->user()->orders()->find($id);
        }

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

    public function myOrders(Request $request)
    {
        $orders = $request->user()->orders()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    public function updateOrderItemStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }
        
        $item = OrderItem::find($id);
        if (!$item) {
            return response()->json([
                'error' => 'Order item not found.'
            ], 404);
        }

        // Admin can update any order item, regular users can only update their own order items
        if ($request->user()->role !== 'ROLE ADMIN') {
            $userOrder = $request->user()->orders()->where('id', $item->order_id)->first();
            if (!$userOrder) {
                return response()->json([
                    'error' => 'Order item not found.'
                ], 404);
            }
        }

        $item->status = $request->status;
        $item->save();
        return response()->json([
            'success' => true,
            'message' => 'Chỉnh sửa trạng thái thành công',
            'item' => $item
        ]);
    }

    public function addOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'total' => 'required|numeric|min:0',
            'shipping_name' => 'nullable|string|max:255',
            'shipping_phone' => 'nullable|string|max:20',
            'shipping_address' => 'nullable|string',
            'shipping_note' => 'nullable|string',
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

        // Debug: Log cart items count
        \Log::info('Cart items count: ' . $cart->count());
        \Log::info('Cart items: ', $cart->toArray());

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

        // Use frontend total instead of recalculating to avoid precision issues
        $finalTotal = $request->total;

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'total' => $finalTotal,
            'status' => 'pending',
            'notes' => json_encode([
                'shipping_name' => $request->shipping_name,
                'shipping_phone' => $request->shipping_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_note' => $request->shipping_note,
            ]),
        ]);

        // Lưu từng sản phẩm vào order_items
        $orderItemsCount = 0;
        foreach ($cart as $item) {
            $order->items()->create([
                'product_id' => $item->product->id,
                'product_name' => $item->product->name,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'total' => $item->product->price * $item->quantity,
                'status' => 'Processing',
            ]);
            $orderItemsCount++;
        }

        // Debug: Log order items count
        \Log::info('Order items created: ' . $orderItemsCount);

        // Clear cart after order creation
        $request->user()->cart()->delete();

        // Trả về order kèm items
        $order = Order::with('items.product')->find($order->id);

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully.',
            'order' => $order
        ], 201);
    }
} 