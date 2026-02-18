<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

/**
 * Seeder tạo categories và products dựa trên ảnh trong storage/app/public/products/.
 * Lưu image_key (path tương đối) và image_url (URL đầy đủ từ APP_URL) để client (localhost:3000) load ảnh.
 *
 * Trước khi chạy:
 * 1. Đảm bảo .env có APP_URL trỏ tới backend (vd: http://localhost:8000).
 * 2. Tạo symlink: php artisan storage:link (public/storage -> storage/app/public).
 *
 * Chạy: php artisan db:seed --class=ProductsFromImagesSeeder
 */
class ProductsFromImagesSeeder extends Seeder
{
    protected $baseUrl;

    /** Danh sách file ảnh => [tên sản phẩm, slug category] */
    protected $images = [
        'balo_chong_nuoc.jpg'       => ['Balo chống nước', 'balo-cap'],
        'bo_dung_cu_ve_tranh.jpg'   => ['Bộ dụng cụ vẽ tranh', 'do-dung-ky-thuat-my-thuat'],
        'bo_lap_rap_ky_thuat_lop_4.jpg' => ['Bộ lắp ráp kỹ thuật lớp 4', 'do-dung-ky-thuat-my-thuat'],
        'bo_lap_rap_ky_thuat_lop_5.jpg' => ['Bộ lắp ráp kỹ thuật lớp 5', 'do-dung-ky-thuat-my-thuat'],
        'bo_the_duc_cap_1.jpg'      => ['Bộ thể dục cấp 1', 'the-duc-dong-phuc'],
        'bo_the_duc_cap_3.jpg'      => ['Bộ thể dục cấp 3', 'the-duc-dong-phuc'],
        'bo_thuc_hanh_cong_nghe_5.jpg' => ['Bộ thực hành công nghệ 5', 'do-dung-ky-thuat-my-thuat'],
        'but_bi_thien_long.png'     => ['Bút bi Thiên Long', 'but-van-phong-pham'],
        'but_chi_go.jpg'            => ['Bút chì gỗ', 'but-van-phong-pham'],
        'but_chi_mau.jpg'           => ['Bút chì màu', 'but-van-phong-pham'],
        'cap_hoc_sinh_cap_1.jpg'    => ['Cặp học sinh cấp 1', 'balo-cap'],
        'giay_bata_iwin.jpg'        => ['Giày bata iWin', 'giay-dep'],
        'giay_bong_data_ining.jpg'  => ['Giày bóng đá ta ining', 'giay-dep'],
        'nha_gia_kim_sach.jpg'      => ['Sách Nhà giả kim', 'sach'],
        'quan_ao_the_duc_cap_1.jpg' => ['Quần áo thể dục cấp 1', 'the-duc-dong-phuc'],
        'sach_di_tim_le_song.jpg'   => ['Sách Đi tìm lẽ sống', 'sach'],
        'sach_giai_tich_lop_12.jpg' => ['Sách Giải tích lớp 12', 'sach'],
        'sach_luoc_su_loai_nguoi.png' => ['Sách Lược sử loài người', 'sach'],
        'sach_luyen_thi_ielts.jpg'  => ['Sách Luyện thi IELTS', 'sach'],
        'sach_tieng_anh_lop_8.jpg'  => ['Sách Tiếng Anh lớp 8', 'sach'],
    ];

    /** Categories: slug => [name, description] */
    protected $categories = [
        'sach' => [
            'name' => 'Sách',
            'description' => 'Sách giáo khoa, sách tham khảo, sách ngoại văn.',
        ],
        'but-van-phong-pham' => [
            'name' => 'Bút & Văn phòng phẩm',
            'description' => 'Bút, bút chì, bút màu và đồ dùng văn phòng.',
        ],
        'balo-cap' => [
            'name' => 'Balo & Cặp',
            'description' => 'Balo, cặp học sinh, túi chống nước.',
        ],
        'do-dung-ky-thuat-my-thuat' => [
            'name' => 'Đồ dùng Kỹ thuật & Mỹ thuật',
            'description' => 'Bộ lắp ráp kỹ thuật, dụng cụ vẽ, thực hành công nghệ.',
        ],
        'the-duc-dong-phuc' => [
            'name' => 'Thể dục & Đồng phục',
            'description' => 'Bộ thể dục, quần áo thể dục, đồng phục học sinh.',
        ],
        'giay-dep' => [
            'name' => 'Giày dép',
            'description' => 'Giày thể thao, giày bata, giày học sinh.',
        ],
    ];

    public function __construct()
    {
        $this->baseUrl = rtrim(config('app.url'), '/');
    }

    public function run()
    {
        $this->ensureCategories();
        $this->ensureProducts();
    }

    protected function ensureCategories()
    {
        foreach ($this->categories as $slug => $data) {
            Category::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'parent_id' => null,
                    'is_active' => true,
                ]
            );
        }
    }

    protected function ensureProducts()
    {
        $index = 0;
        foreach ($this->images as $filename => [$name, $categorySlug]) {
            $index++;
            $slug = Str::slug($name);
            $category = Category::where('slug', $categorySlug)->first();
            $categoryId = $category ? $category->id : null;

            $imageKey = 'products/' . $filename;
            $imageUrl = $this->baseUrl . '/storage/' . $imageKey;

            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'sku' => 'IMG-' . str_pad($index, 4, '0', STR_PAD_LEFT),
                    'name' => $name,
                    'image_key' => $imageKey,
                    'image_url' => $imageUrl,
                    'description' => 'Sản phẩm ' . $name . '. Chất lượng tốt, phù hợp học tập và sử dụng hàng ngày.',
                    'quantity' => rand(20, 200),
                    'price' => rand(15, 250) * 1000,
                    'taxable' => true,
                    'is_active' => true,
                    'brand_id' => null,
                    'category_id' => $categoryId,
                ]
            );
        }
    }
}
