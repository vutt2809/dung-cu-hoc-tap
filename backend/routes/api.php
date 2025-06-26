<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\MerchantController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot', [AuthController::class, 'forgot']);
    Route::post('/reset', [AuthController::class, 'reset']);
});

// Public product routes
Route::get('/product', [ProductController::class, 'index']);
Route::get('/product/{slug}', [ProductController::class, 'show']);

// Public category routes
Route::get('/category', [CategoryController::class, 'index']);
Route::get('/category/{id}', [CategoryController::class, 'show']);

// Public brand routes
Route::get('/brand', [BrandController::class, 'index']);
Route::get('/brand/{id}', [BrandController::class, 'show']);

// Public contact route
Route::post('/contact', [ContactController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // User routes
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/', [UserController::class, 'update']);
        Route::put('/password', [UserController::class, 'updatePassword']);
    });

    // Address routes
    Route::prefix('address')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
        Route::put('/{id}/default', [AddressController::class, 'setDefault']);
    });

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
        Route::delete('/', [CartController::class, 'clear']);
    });

    // Order routes
    Route::prefix('order')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::post('/add', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::put('/{id}/cancel', [OrderController::class, 'cancel']);
    });

    // Wishlist routes
    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/', [WishlistController::class, 'store']);
        Route::delete('/{id}', [WishlistController::class, 'destroy']);
    });

    // Review routes
    Route::prefix('review')->group(function () {
        Route::get('/product/{productId}', [ReviewController::class, 'index']);
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
    });

    // Admin/Merchant routes
    Route::middleware(['auth:sanctum'])->group(function () {
        // Product management
        Route::prefix('product')->group(function () {
            Route::post('/', [ProductController::class, 'store']);
            Route::put('/{id}', [ProductController::class, 'update']);
            Route::delete('/{id}', [ProductController::class, 'destroy']);
            Route::put('/{id}/active', [ProductController::class, 'toggleActive']);
        });

        // Category management
        Route::prefix('category')->group(function () {
            Route::post('/', [CategoryController::class, 'store']);
            Route::put('/{id}', [CategoryController::class, 'update']);
            Route::delete('/{id}', [CategoryController::class, 'destroy']);
            Route::put('/{id}/active', [CategoryController::class, 'toggleActive']);
        });

        // Brand management
        Route::prefix('brand')->group(function () {
            Route::post('/', [BrandController::class, 'store']);
            Route::put('/{id}', [BrandController::class, 'update']);
            Route::delete('/{id}', [BrandController::class, 'destroy']);
            Route::put('/{id}/active', [BrandController::class, 'toggleActive']);
            Route::get('/list/select', [BrandController::class, 'listForSelect']);
        });

        // Merchant management
        Route::prefix('merchant')->group(function () {
            Route::get('/', [MerchantController::class, 'index']);
            Route::post('/', [MerchantController::class, 'store']);
            Route::put('/{id}', [MerchantController::class, 'update']);
            Route::delete('/{id}', [MerchantController::class, 'destroy']);
            Route::put('/{id}/active', [MerchantController::class, 'toggleActive']);
        });
    });
});

// Catch-all route for undefined API endpoints
Route::fallback(function () {
    return response()->json(['error' => 'No API route found'], 404);
});
