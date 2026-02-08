<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $brands = [
            'Thiên Long',
            'Hồng Hà',
            'Deli',
            'Campus',
            'Pentel',
            'Double A',
        ];

        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand,
                'slug' => Str::slug($brand),
                'description' => "Sản phẩm chính hãng của $brand",
                'is_active' => true,
            ]);
        }
    }
}
