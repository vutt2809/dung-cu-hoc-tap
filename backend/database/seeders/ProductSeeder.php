<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $brands = Brand::all();
        $categories = Category::whereNotNull('parent_id')->get(); // Get sub-categories
        if ($categories->isEmpty()) {
            $categories = Category::all();
        }

        $products = [
            'Bút bi Thiên Long 0.5mm',
            'Bút máy điểm 10',
            'Vở học sinh 96 trang',
            'Sổ tay lò xo A5',
            'Thước kẻ nhựa 20cm',
            'Compa học sinh',
            'Tẩy chì Staedtler',
            'Giấy A4 Double A 70gsm',
            'Bấm kim số 10',
            'Hồ khô dán giấy',
            'Bút chì gỗ 2B',
            'Bìa lá A4',
            'Bút dạ quang vàng',
            'Gôm tẩy Deli',
            'Chuốt chì Maped',
        ];

        foreach ($products as $index => $name) {
            Product::create([
                'sku' => 'P' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'name' => $name,
                'slug' => Str::slug($name) . '-' . Str::random(5),
                'description' => "Mô tả chi tiết cho sản phẩm $name. Chất lượng cao, giá cả phải chăng.",
                'quantity' => rand(10, 100),
                'price' => rand(5, 100) * 1000,
                'taxable' => true,
                'is_active' => true,
                'brand_id' => $brands->random()->id,
                'category_id' => $categories->random()->id,
                'image_url' => 'https://via.placeholder.com/300x300.png?text=' . urlencode($name),
            ]);
        }
    }
}
