# Test Tính năng Tích hợp User với Address

## Mục đích
Kiểm tra việc lấy thông tin họ tên từ bảng user khi chọn địa chỉ đã lưu.

## Test Cases

### 1. Test API Address với User Relationship

**Endpoint:** `GET /api/address`
**Headers:** `Authorization: Bearer {token}`

**Expected Response:**
```json
{
  "success": true,
  "addresses": [
    {
      "id": 1,
      "user_id": 1,
      "address": "123 Lê Lợi",
      "city": "Cần Thơ",
      "state": "Cái Răng",
      "zip_code": "900003",
      "country": "Vietnam",
      "phone_number": "0911000004",
      "is_default": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "user": {
        "id": 1,
        "first_name": "Admin",
        "last_name": "One",
        "email": "admin@example.com"
      }
    }
  ]
}
```

### 2. Test Logic Lấy Họ Tên

**Scenario 1: User có first_name và last_name**
- Input: `first_name: "Nguyễn Văn", last_name: "A"`
- Expected: `shipping_name: "Nguyễn Văn A"`

**Scenario 2: User chỉ có first_name**
- Input: `first_name: "Nguyễn Văn", last_name: null`
- Expected: `shipping_name: "Nguyễn Văn"`

**Scenario 3: User chỉ có last_name**
- Input: `first_name: null, last_name: "Văn A"`
- Expected: `shipping_name: "Văn A"`

**Scenario 4: User không có first_name và last_name, có email**
- Input: `first_name: null, last_name: null, email: "user@example.com"`
- Expected: `shipping_name: "user"`

**Scenario 5: User không có thông tin gì**
- Input: `first_name: null, last_name: null, email: null`
- Expected: `shipping_name: form.shipping_name` (giữ nguyên giá trị hiện tại)

### 3. Test Frontend Display

**Test 1: Hiển thị tên user trong danh sách địa chỉ**
- Khi có thông tin user: Hiển thị tên user với font-weight: 600
- Khi không có thông tin user: Không hiển thị tên

**Test 2: Tự động điền form khi chọn địa chỉ**
- Chọn địa chỉ → Form tự động điền với thông tin user
- Kiểm tra `shipping_name`, `shipping_phone`, `shipping_address`

**Test 3: Hiển thị địa chỉ đã chọn**
- Hiển thị tên user, địa chỉ, số điện thoại
- Có nút "Thay đổi" để chọn lại địa chỉ khác

## Cách Test

### 1. Test Backend
```bash
# Test API address với user relationship
curl -X GET "http://localhost:8000/api/address" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### 2. Test Frontend
1. Đăng nhập vào hệ thống
2. Vào trang checkout
3. Kiểm tra danh sách địa chỉ có hiển thị tên user không
4. Chọn một địa chỉ
5. Kiểm tra form có tự động điền đúng thông tin không
6. Kiểm tra phần "Địa chỉ đã chọn" có hiển thị đầy đủ thông tin không

### 3. Test Database
```sql
-- Kiểm tra quan hệ giữa address và user
SELECT 
    a.id,
    a.address,
    a.city,
    u.first_name,
    u.last_name,
    u.email
FROM addresses a
JOIN users u ON a.user_id = u.id
WHERE a.user_id = 1;
```

## Kết quả mong đợi

1. ✅ API trả về đúng thông tin user trong address
2. ✅ Frontend hiển thị tên user trong danh sách địa chỉ
3. ✅ Tự động điền form với thông tin user khi chọn địa chỉ
4. ✅ Xử lý đúng các trường hợp user không có thông tin
5. ✅ UI hiển thị đẹp và responsive

## Lưu ý

- Đảm bảo user đã đăng nhập trước khi test
- Kiểm tra console browser để xem có lỗi JavaScript không
- Test trên cả desktop và mobile
- Kiểm tra performance khi load danh sách địa chỉ
