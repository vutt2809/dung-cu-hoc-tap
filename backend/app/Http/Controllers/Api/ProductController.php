<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'category'])->active();

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

        // Search by name, SKU, or description
        if ($request->has('search') || $request->has('name')) {
            $search = $request->get('search', $request->get('name'));
            if ($search && $search != 'all') {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('sku', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%');
                });
            }
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

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    public function show($id_or_slug)
    {
        $query = Product::with(['brand', 'category', 'reviews.user'])->active();

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
            'brand' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['is_active'] = true;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_key'] = $path;
            $data['image_url'] = rtrim(config('app.url'), '/') . ':3000/storage/' . $path;
        }

        if ($request->has('brand') && !$request->has('brand_id')) {
            $data['brand_id'] = $request->brand;
            unset($data['brand']);
        }

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'product' => $product->load(['brand', 'category'])
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
            'taxable' => 'sometimes|boolean',
            'brand' => 'nullable|exists:brands,id',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'sometimes|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $data = $request->all();
        
        // Ưu tiên lấy slug từ request, nếu không có thì tạo từ name
        if ($request->has('slug')) {
            $data['slug'] = $request->slug;
        } elseif ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        // Xử lý field brand từ frontend
        if ($request->has('brand') && !$request->has('brand_id')) {
            $data['brand_id'] = $request->brand;
            unset($data['brand']);
        }

        // Xử lý field is_active
        if ($request->has('is_active')) {
            $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            if ($product->image_key) {
                Storage::disk('public')->delete($product->image_key);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image_key'] = $path;
            $data['image_url'] = rtrim(config('app.url'), '/') . '/storage/' . $path;
        }

        // Xử lý field taxable
        if ($request->has('taxable')) {
            $data['taxable'] = filter_var($request->taxable, FILTER_VALIDATE_BOOLEAN);
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'product' => $product->load(['brand', 'category'])
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