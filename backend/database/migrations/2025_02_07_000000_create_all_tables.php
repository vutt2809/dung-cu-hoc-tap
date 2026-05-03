<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Users Table
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->string('phone_number')->nullable();
                $table->string('first_name');
                $table->string('last_name');
                $table->string('password');
                $table->string('provider')->nullable();
                $table->string('google_id')->nullable();
                $table->string('facebook_id')->nullable();
                $table->string('avatar')->nullable();
                $table->string('role')->default('member'); // admin, member
                $table->string('reset_password_token')->nullable();
                $table->timestamp('reset_password_expires')->nullable();
                $table->rememberToken();
                $table->timestamps();
            });
        }

        // 2. Brands Table
        if (!Schema::hasTable('brands')) {
            Schema::create('brands', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // 3. Categories Table
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->unsignedBigInteger('parent_id')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->foreign('parent_id')->references('id')->on('categories')->onDelete('set null');
            });
        }

        // 4. Products Table
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('sku')->unique();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('image_url')->nullable();
                $table->string('image_key')->nullable();
                $table->text('description')->nullable();
                $table->integer('quantity')->default(0);
                $table->decimal('price', 10, 2);
                $table->boolean('taxable')->default(false);
                $table->boolean('is_active')->default(true);
                $table->unsignedBigInteger('brand_id')->nullable();
                $table->unsignedBigInteger('category_id')->nullable();
                $table->timestamps();

                $table->foreign('brand_id')->references('id')->on('brands')->onDelete('set null');
                $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            });
        }

        // 5. Addresses Table
        if (!Schema::hasTable('addresses')) {
            Schema::create('addresses', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('address');
                $table->string('city');
                $table->string('state')->nullable();
                $table->string('zip_code')->nullable();
                $table->string('country')->nullable();
                $table->string('phone_number')->nullable();
                $table->boolean('is_default')->default(false);
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // 6. Orders Table
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable(); // Có thể mua hàng không cần account? Thường là cần, nhưng để nullable cho an toàn
                $table->string('order_number')->unique();
                $table->decimal('total', 10, 2);
                $table->string('status')->default('pending'); // pending, processing, completed, cancelled
                $table->text('notes')->nullable();
                // Shipping details stored with order (snapshot)
                $table->string('shipping_name')->nullable();
                $table->string('shipping_phone')->nullable();
                $table->string('shipping_address')->nullable();
                $table->text('shipping_note')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            });
        }

        // 7. Order Items Table
        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id');
                $table->unsignedBigInteger('product_id')->nullable(); // Product might be deleted, keep record
                $table->string('product_name'); // Snapshot name
                $table->decimal('price', 10, 2); // Snapshot price
                $table->integer('quantity');
                $table->decimal('total', 10, 2);
                $table->string('status')->nullable(); 
                $table->timestamps();

                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            });
        }

        // 8. Carts Table (optional per design, often stored in session or redis, but model exists)
        if (!Schema::hasTable('carts')) {
            Schema::create('carts', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('product_id');
                $table->integer('quantity')->default(1);
                $table->decimal('price', 10, 2)->nullable(); // Optional if dynamic
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            });
        }

        // 9. Wishlists Table
        if (!Schema::hasTable('wishlists')) {
            Schema::create('wishlists', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('product_id');
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            });
        }

        // 10. Reviews Table
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('product_id');
                $table->string('title')->nullable();
                $table->text('comment')->nullable();
                $table->integer('rating')->default(5);
                $table->integer('status')->default(0); // 0: pending, 1: approved, -1: rejected
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            });
        }

        // 11. Password Resets (personal_access_tokens: migration 2019_12_14_000001)
        if (!Schema::hasTable('password_resets')) {
            Schema::create('password_resets', function (Blueprint $table) {
                $table->string('email')->index();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('users');
    }
};
