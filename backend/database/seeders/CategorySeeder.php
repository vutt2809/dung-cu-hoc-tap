<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            'Bút viết' => [
                'Bút bi',
                'Bút máy',
                'Bút chì',
                'Bút dạ quang',
            ],
            'Dụng cụ học tập' => [
                'Thước kẻ',
                'Compa',
                'Tẩy',
                'Chuốt bút chì',
            ],
            'Vở - Sổ' => [
                'Vở học sinh',
                'Sổ tay',
                'Giấy note',
            ],
            'Văn phòng phẩm' => [
                'Kẹp giấy',
                'Bấm kim',
                'Hồ dán',
                'Bìa hồ sơ',
            ],
        ];

        foreach ($categories as $parentName => $children) {
            $parent = Category::create([
                'name' => $parentName,
                'slug' => Str::slug($parentName),
                'description' => "Danh mục $parentName",
                'is_active' => true,
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'description' => "Danh mục con $childName",
                    'parent_id' => $parent->id,
                    'is_active' => true,
                ]);
            }
        }
    }
}
