# Hướng dẫn cập nhật hệ thống Review từ is_active sang status

## Tổng quan thay đổi

### Trước đây:
- Sử dụng trường `is_active` (boolean)
- `is_active = true` → Review được hiển thị
- `is_active = false` → Review không được hiển thị

### Bây giờ:
- Sử dụng trường `status` (integer)
- `status = 1` → Duyệt (hiển thị)
- `status = 0` → Đang chờ (không hiển thị)
- `status = -1` → Không duyệt (không hiển thị)

## Các file đã được cập nhật

### Backend:
1. **`backend/app/Models/Review.php`**
   - Thêm constants cho status
   - Cập nhật fillable fields
   - Thêm scope methods và helper methods

2. **`backend/app/Http/Controllers/Api/ReviewController.php`**
   - Cập nhật logic phê duyệt/từ chối
   - Sử dụng constants thay vì hardcode values

### Frontend:
1. **`client/app/constants/index.js`**
   - Cập nhật REVIEW_STATUS constants

2. **`client/app/components/Manager/ReviewList/index.js`**
   - Hiển thị trạng thái với icons và màu sắc
   - Thêm nút "Từ chối" cho reviews đang chờ

3. **`client/app/containers/Review/actions.js`**
   - Cập nhật approveReview và rejectReview actions
   - Thêm thông báo thành công

4. **`client/app/containers/Review/reducer.js`**
   - Loại bỏ isRecommended field
   - Sửa lỗi typo trong REMOVE_REVIEW

5. **`client/app/containers/Review/index.js`**
   - Truyền rejectReview function

## Cách thực hiện cập nhật

### Bước 1: Backup database
```bash
mysqldump -u your_username -p your_database > backup_before_review_update.sql
```

### Bước 2: Chạy SQL script cập nhật database
```bash
mysql -u your_username -p your_database < update_reviews_status.sql
```

### Bước 3: Kiểm tra kết quả
```sql
-- Kiểm tra cấu trúc bảng
DESCRIBE reviews;

-- Kiểm tra dữ liệu
SELECT 
    CASE 
        WHEN status = 1 THEN 'Đã duyệt'
        WHEN status = 0 THEN 'Đang chờ'
        WHEN status = -1 THEN 'Đã từ chối'
        ELSE 'Không xác định'
    END as status_name,
    COUNT(*) as count
FROM `reviews` 
GROUP BY status 
ORDER BY status;
```

### Bước 4: Test các tính năng
1. **Tạo review mới** → Status mặc định = 0 (Đang chờ)
2. **Phê duyệt review** → Status = 1 (Duyệt)
3. **Từ chối review** → Status = -1 (Không duyệt)
4. **Hiển thị reviews** → Chỉ hiển thị reviews có status = 1

## Cấu trúc database mới

```sql
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `comment` text,
  `status` int NOT NULL DEFAULT 0 COMMENT '1: Duyệt, 0: Đang chờ, -1: Không duyệt',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_status_index` (`status`),
  KEY `reviews_product_id_index` (`product_id`),
  KEY `reviews_user_id_index` (`user_id`),
  KEY `reviews_created_at_index` (`created_at`)
);
```

## Luồng hoạt động mới

### 1. User tạo review
- Review được tạo với `status = 0` (Đang chờ)
- Không hiển thị trên frontend

### 2. Admin phê duyệt
- Cập nhật `status = 1` (Duyệt)
- Review hiển thị trên frontend

### 3. Admin từ chối
- Cập nhật `status = -1` (Không duyệt)
- Review không hiển thị trên frontend

### 4. Hiển thị reviews
- Chỉ hiển thị reviews có `status = 1`
- Sử dụng scope `active()` trong model

## Lưu ý quan trọng

1. **Backup database** trước khi chạy script
2. **Test kỹ** các tính năng sau khi cập nhật
3. **Kiểm tra** dữ liệu cũ có được chuyển đổi đúng không
4. **Cập nhật documentation** nếu cần

## Troubleshooting

### Nếu có lỗi khi chạy SQL:
1. Kiểm tra quyền database user
2. Kiểm tra cấu trúc bảng hiện tại
3. Chạy từng câu lệnh một để debug

### Nếu frontend không hoạt động:
1. Kiểm tra console errors
2. Kiểm tra network requests
3. Verify API responses

### Nếu dữ liệu không đúng:
1. Kiểm tra script migration
2. Restore từ backup nếu cần
3. Chạy lại script với dữ liệu mẫu 