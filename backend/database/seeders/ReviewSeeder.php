<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Product;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        // Create 50 random reviews
        for ($i = 0; $i < 50; $i++) {
            Review::create([
                'user_id' => $users->random()->id,
                'product_id' => $products->random()->id,
                'title' => 'Đánh giá sản phẩm',
                'comment' => 'Sản phẩm dùng rất tốt, tôi rất hài lòng!',
                'rating' => rand(3, 5),
                'status' => 1, // Approved
            ]);
        }
    }
}
