-- =====================================================
-- UPDATE REVIEWS TABLE FROM IS_ACTIVE TO STATUS
-- =====================================================

-- Bước 1: Thêm cột status mới
-- =====================================================
ALTER TABLE `reviews` 
ADD COLUMN `status` int NOT NULL DEFAULT 0 COMMENT '1: Duyệt, 0: Đang chờ, -1: Không duyệt';

-- Bước 2: Cập nhật dữ liệu từ is_active sang status
-- =====================================================
-- Chuyển đổi is_active = 1 thành status = 1 (Duyệt)
UPDATE `reviews` 
SET `status` = 1 
WHERE `is_active` = 1;

-- Chuyển đổi is_active = 0 thành status = 0 (Đang chờ)
UPDATE `reviews` 
SET `status` = 0 
WHERE `is_active` = 0 OR `is_active` IS NULL;

-- Bước 3: Cập nhật cột comment nếu cần
-- =====================================================
-- Đảm bảo cột comment tồn tại (thay thế cho review nếu có)
ALTER TABLE `reviews` 
MODIFY COLUMN `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

-- Bước 4: Xóa cột is_active và is_recommended cũ
-- =====================================================
ALTER TABLE `reviews` 
DROP COLUMN IF EXISTS `is_active`,
DROP COLUMN IF EXISTS `is_recommended`,
DROP COLUMN IF EXISTS `review`;

-- Bước 5: Thêm indexes để tối ưu hiệu suất
-- =====================================================
ALTER TABLE `reviews` ADD INDEX `reviews_status_index` (`status`);
ALTER TABLE `reviews` ADD INDEX `reviews_product_id_index` (`product_id`);
ALTER TABLE `reviews` ADD INDEX `reviews_user_id_index` (`user_id`);
ALTER TABLE `reviews` ADD INDEX `reviews_created_at_index` (`created_at`);

-- Bước 6: Kiểm tra kết quả
-- =====================================================

-- Hiển thị cấu trúc bảng reviews sau khi cập nhật
DESCRIBE reviews;

-- Kiểm tra số lượng reviews theo trạng thái
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

-- Hiển thị một số reviews mẫu
SELECT 
    id,
    product_id,
    user_id,
    title,
    LEFT(comment, 50) as comment_preview,
    rating,
    status,
    created_at
FROM `reviews` 
ORDER BY created_at DESC 
LIMIT 10; 