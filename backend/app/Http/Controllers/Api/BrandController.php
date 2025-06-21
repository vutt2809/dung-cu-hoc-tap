<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'brands' => $brands
        ]);
    }

    public function show($id)
    {
        $brand = Brand::where('id', $id)
            ->where('is_active', true)
            ->with('products')
            ->first();

        if (!$brand) {
            return response()->json([
                'error' => 'Brand not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'brand' => $brand
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'is_active' => 'boolean',
            'merchant_id' => 'nullable|exists:merchants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $brand = Brand::create([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $request->logo,
            'is_active' => $request->is_active ?? true,
            'merchant_id' => $request->merchant_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Brand created successfully.',
            'brand' => $brand
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'error' => 'Brand not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name,' . $id,
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'is_active' => 'boolean',
            'merchant_id' => 'nullable|exists:merchants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $brand->update([
            'name' => $request->name,
            'description' => $request->description,
            'logo' => $request->logo,
            'is_active' => $request->is_active,
            'merchant_id' => $request->merchant_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Brand updated successfully.',
            'brand' => $brand
        ]);
    }

    public function destroy($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'error' => 'Brand not found.'
            ], 404);
        }

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully.'
        ]);
    }

    public function toggleActive($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'error' => 'Brand not found.'
            ], 404);
        }

        $brand->update([
            'is_active' => !$brand->is_active
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Brand status updated successfully.',
            'brand' => $brand
        ]);
    }

    public function listForSelect()
    {
        $brands = Brand::where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'brands' => $brands
        ]);
    }
} 