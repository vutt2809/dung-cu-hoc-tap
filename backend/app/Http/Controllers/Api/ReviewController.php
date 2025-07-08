<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index($slug)
    {
        $product = Product::where('slug', $slug)->first();
        
        if (!$product) {
            return response()->json([
                'error' => 'Product not found.'
            ], 404);
        }

        $reviews = Review::where('product_id', $product->id)
                        ->active()
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
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5'
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
            'comment' => $request->comment,
            'rating' => $request->rating,
            'status' => Review::STATUS_PENDING
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
            'comment' => 'sometimes|required|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
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

    public function list(Request $request)
    {
        $limit = $request->input('limit', 20);
        $reviews = Review::with(['user', 'product'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json([
            'success' => true,
            'reviews' => $reviews->items(),
            'totalPages' => $reviews->lastPage(),
            'currentPage' => $reviews->currentPage(),
            'count' => $reviews->total()
        ]);
    }

    public function approve($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found.'], 404);
        }
        
        $review->status = Review::STATUS_APPROVED;
        $review->save();
        
        return response()->json(['success' => true, 'message' => 'Phê duyệt thành công.']);
    }

    public function reject($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found.'], 404);
        }
        
        $review->status = Review::STATUS_REJECTED;
        $review->save();
        
        return response()->json(['success' => true, 'message' => 'Từ chối thành công.']);
    }
} 