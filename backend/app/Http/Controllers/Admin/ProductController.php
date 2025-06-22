<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['brand', 'category', 'merchant'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('admin.products.index', compact('products'));
    }

    public function show($id)
    {
        $product = Product::with(['brand', 'category', 'merchant'])->findOrFail($id);
        
        return view('admin.products.show', compact('product'));
    }
} 