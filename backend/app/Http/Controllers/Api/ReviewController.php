<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)
                        ->where('is_active', true)
                        ->with('user')
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json([
            'success' => true,
            'reviews' => $reviews
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_recommended' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $existingReview = $request->user()->reviews()
                                        ->where('product_id', $request->product_id)
                                        ->first();

        if ($existingReview) {
            return response()->json([
                'error' => 'You have already reviewed this product.'
            ], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'title' => $request->title,
            'review' => $request->review,
            'rating' => $request->rating,
            'is_recommended' => $request->is_recommended ?? true,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review added successfully.',
            'review' => $review->load('user')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $review = $request->user()->reviews()->find($id);

        if (!$review) {
            return response()->json([
                'error' => 'Review not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'review' => 'sometimes|required|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'is_recommended' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $review->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully.',
            'review' => $review->load('user')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $review = $request->user()->reviews()->find($id);

        if (!$review) {
            return response()->json([
                'error' => 'Review not found.'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.'
        ]);
    }
} 