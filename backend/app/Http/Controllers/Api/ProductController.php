<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'category', 'merchant'])->active();

        // Filter by brand
        if ($request->has('brand') && $request->brand != 'all') {
            $brand_id_or_slug = $request->brand;
            $query->whereHas('brand', function ($q) use ($brand_id_or_slug) {
                if (is_numeric($brand_id_or_slug)) {
                    $q->where('id', $brand_id_or_slug);
                } else {
                    $q->where('slug', $brand_id_or_slug);
                }
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category != 'all') {
            $category_id_or_slug = $request->category;
            $query->whereHas('category', function ($q) use ($category_id_or_slug) {
                if (is_numeric($category_id_or_slug)) {
                    $q->where('id', $category_id_or_slug);
                } else {
                    $q->where('slug', $category_id_or_slug);
                }
            });
        }

        // Filter by price range
        if ($request->has('min') && $request->has('max')) {
            $query->whereBetween('price', [$request->min, $request->max]);
        }

        // Filter by rating
        if ($request->has('rating') && $request->rating > 0) {
            // This requires products to have at least one review
            $query->whereHas('reviews', function ($q) use ($request) {
                // You can add more complex logic here if needed
            })->withAvg('reviews', 'rating')->having('reviews_avg_rating', '>=', $request->rating);
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort - Use 'order' from request, which seems to be numeric
        if ($request->has('order')) {
            switch ($request->order) {
                case 'price_desc': // Price High to Low
                    $query->orderBy('price', 'desc');
                    break;
                case 'price_asc': // Price Low to High
                    $query->orderBy('price', 'asc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                default: // Newest
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(12);

        // Add wishlist status for authenticated users
        if ($request->user()) {
            $userWishlistIds = $request->user()->wishlist()->pluck('product_id')->toArray();
            
            $products->getCollection()->transform(function ($product) use ($userWishlistIds) {
                $product->isLiked = in_array($product->id, $userWishlistIds);
                return $product;
            });
        }

        // Ensure image_url is included in the response
        $products->getCollection()->transform(function ($product) {
            // Make sure image_url is available
            if (!$product->image_url && $product->image_key) {
                // If you have image_key but no image_url, you might want to construct the URL
                // $product->image_url = config('app.url') . '/storage/' . $product->image_key;
            }
            return $product;
        });

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    public function show($id_or_slug)
    {
        $query = Product::with(['brand', 'category', 'merchant', 'reviews.user'])->active();

        if (is_numeric($id_or_slug)) {
            $product = $query->where('id', $id_or_slug)->first();
        } else {
            $product = $query->where('slug', $id_or_slug)->first();
        }

        if (!$product) {
            return response()->json([
                'error' => 'Product not found.'
            ], 404);
        }

        // Add wishlist status for authenticated users
        if (request()->user()) {
            $isLiked = request()->user()->wishlist()->where('product_id', $product->id)->exists();
            $product->isLiked = $isLiked;
        }

        // Ensure image_url is included in the response
        if (!$product->image_url && $product->image_key) {
            // If you have image_key but no image_url, you might want to construct the URL
            // $product->image_url = config('app.url') . '/storage/' . $product->image_key;
        }

        return response()->json([
            'success' => true,
            'product' => $product
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'taxable' => 'boolean',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'merchant_id' => 'nullable|exists:merchants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['is_active'] = true;

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'product' => $product->load(['brand', 'category', 'merchant'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'sometimes|required|integer|min:0',
            'price' => 'sometimes|required|numeric|min:0',
            'taxable' => 'boolean',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'merchant_id' => 'nullable|exists:merchants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $data = $request->all();
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'product' => $product->load(['brand', 'category', 'merchant'])
        ]);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found.'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.'
        ]);
    }

    public function toggleActive($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found.'
            ], 404);
        }

        $product->update(['is_active' => !$product->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Product status updated successfully.',
            'product' => $product
        ]);
    }
} 