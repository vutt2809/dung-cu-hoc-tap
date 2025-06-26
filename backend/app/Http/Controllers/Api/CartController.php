<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->with('product')->get();

        return response()->json([
            'success' => true,
            'cart' => $cart
        ]);
    }

    public function store(Request $request)
    {
        if ($request->has('products') && is_array($request->products)) {
            $results = [];
            foreach ($request->products as $item) {
                $validator = Validator::make($item, [
                    'product' => 'required|exists:products,id',
                    'quantity' => 'required|integer|min:1',
                    'price' => 'required|numeric',
                    'taxable' => 'sometimes|boolean',
                ]);
                if ($validator->fails()) {
                    return response()->json([
                        'error' => $validator->errors()->first()
                    ], 400);
                }
                $product = Product::find($item['product']);
                if (!$product->is_active) {
                    return response()->json([
                        'error' => 'Product is not available.'
                    ], 400);
                }
                if ($product->quantity < $item['quantity']) {
                    return response()->json([
                        'error' => 'Insufficient product quantity.'
                    ], 400);
                }
                $existingCart = $request->user()->cart()
                    ->where('product_id', $item['product'])
                    ->first();
                if ($existingCart) {
                    $existingCart->update([
                        'quantity' => $existingCart->quantity + $item['quantity'],
                        'price' => $item['price'],
                        'taxable' => $item['taxable'] ?? false,
                    ]);
                    $cart = $existingCart;
                } else {
                    $cart = Cart::create([
                        'user_id' => $request->user()->id,
                        'product_id' => $item['product'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                        'taxable' => $item['taxable'] ?? false,
                    ]);
                }
                $results[] = $cart->load('product');
            }
            return response()->json([
                'success' => true,
                'message' => 'Products added to cart successfully.',
                'cart' => $results
            ], 201);
        }
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric',
            'taxable' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $product = Product::find($request->product_id);
        
        if (!$product->is_active) {
            return response()->json([
                'error' => 'Product is not available.'
            ], 400);
        }

        if ($product->quantity < $request->quantity) {
            return response()->json([
                'error' => 'Insufficient product quantity.'
            ], 400);
        }

        $existingCart = $request->user()->cart()
                                      ->where('product_id', $request->product_id)
                                      ->first();

        if ($existingCart) {
            $existingCart->update([
                'quantity' => $existingCart->quantity + $request->quantity,
                'price' => $request->price,
                'taxable' => $request->taxable ?? false,
            ]);
            $cart = $existingCart;
        } else {
            $cart = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'taxable' => $request->taxable ?? false,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully.',
            'cart' => $cart->load('product')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $cart = $request->user()->cart()->find($id);

        if (!$cart) {
            return response()->json([
                'error' => 'Cart item not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        if ($cart->product->quantity < $request->quantity) {
            return response()->json([
                'error' => 'Insufficient product quantity.'
            ], 400);
        }

        $cart->update(['quantity' => $request->quantity]);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully.',
            'cart' => $cart->load('product')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $cart = $request->user()->cart()->find($id);

        if (!$cart) {
            return response()->json([
                'error' => 'Cart item not found.'
            ], 404);
        }

        $cart->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully.'
        ]);
    }

    public function clear(Request $request)
    {
        $request->user()->cart()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.'
        ]);
    }
} 