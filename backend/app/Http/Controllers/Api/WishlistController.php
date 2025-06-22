<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()->wishlist()->with('product')->get();

        return response()->json([
            'success' => true,
            'wishlist' => $wishlist
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $existingWishlist = $request->user()->wishlist()
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingWishlist) {
            // If already in wishlist, remove it (toggle behavior)
            $existingWishlist->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist successfully.',
                'action' => 'removed'
            ]);
        }

        // Add to wishlist
        $wishlist = Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist successfully.',
            'wishlist' => $wishlist,
            'action' => 'added'
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $wishlist = $request->user()->wishlist()->find($id);

        if (!$wishlist) {
            return response()->json([
                'error' => 'Wishlist item not found.'
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from wishlist successfully.'
        ]);
    }
} 