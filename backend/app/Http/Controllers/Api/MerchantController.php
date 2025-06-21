<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MerchantController extends Controller
{
    public function index()
    {
        $merchants = Merchant::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'merchants' => $merchants
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:merchants',
            'phone_number' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'business' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'avatar' => 'nullable|string|max:255',
            'brand_name' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $merchant = Merchant::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'brand' => $request->brand,
            'business' => $request->business,
            'is_active' => $request->is_active ?? true,
            'is_verified' => $request->is_verified ?? false,
            'avatar' => $request->avatar,
            'brand_name' => $request->brand_name,
            'status' => $request->status ?? 'Waiting Approval',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Merchant created successfully.',
            'merchant' => $merchant
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $merchant = Merchant::find($id);

        if (!$merchant) {
            return response()->json([
                'error' => 'Merchant not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:merchants,email,' . $id,
            'phone_number' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'business' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'avatar' => 'nullable|string|max:255',
            'brand_name' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        $merchant->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'brand' => $request->brand,
            'business' => $request->business,
            'is_active' => $request->is_active,
            'is_verified' => $request->is_verified,
            'avatar' => $request->avatar,
            'brand_name' => $request->brand_name,
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Merchant updated successfully.',
            'merchant' => $merchant
        ]);
    }

    public function destroy($id)
    {
        $merchant = Merchant::find($id);

        if (!$merchant) {
            return response()->json([
                'error' => 'Merchant not found.'
            ], 404);
        }

        $merchant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Merchant deleted successfully.'
        ]);
    }

    public function toggleActive($id)
    {
        $merchant = Merchant::find($id);

        if (!$merchant) {
            return response()->json([
                'error' => 'Merchant not found.'
            ], 404);
        }

        $merchant->update([
            'is_active' => !$merchant->is_active
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Merchant status updated successfully.',
            'merchant' => $merchant
        ]);
    }
} 