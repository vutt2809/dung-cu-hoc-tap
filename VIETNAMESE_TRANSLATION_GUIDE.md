# Hướng dẫn cập nhật tiếng Việt cho MERN Ecommerce

## Đã hoàn thành

### 1. File ngôn ngữ
- ✅ `client/app/constants/vi.js` - File chứa tất cả text tiếng Việt

### 2. Components đã cập nhật
- ✅ Navigation (Header)
- ✅ NavigationMenu (Menu danh mục)
- ✅ Footer
- ✅ Checkout
- ✅ OrderMeta
- ✅ AccountMenu
- ✅ AddBrand
- ✅ AddMerchant
- ✅ ProductReviews/Add
- ✅ ReviewList
- ✅ Contact
- ✅ Newsletter
- ✅ Error Handler
- ✅ Category List/Add/Edit
- ✅ AddCategory

## Cần tiếp tục cập nhật

### 3. Components còn lại cần cập nhật

#### Authentication Components
- [ ] `client/app/containers/Login/index.js`
- [ ] `client/app/containers/Signup/index.js`
- [ ] `client/app/containers/ForgotPassword/index.js`
- [ ] `client/app/containers/ResetPassword/index.js`

#### Dashboard Components
- [ ] `client/app/containers/Dashboard/Admin.js`
- [ ] `client/app/containers/Dashboard/Customer.js`
- [ ] `client/app/containers/Dashboard/Merchant.js`

#### Product Components
- [ ] `client/app/containers/Product/Add.js`
- [ ] `client/app/containers/Product/Edit.js`
- [ ] `client/app/containers/Product/List.js`
- [ ] `client/app/components/Manager/AddProduct/index.js`
- [ ] `client/app/components/Manager/EditProduct/index.js`

#### Order Components
- [ ] `client/app/containers/Order/List.js`
- [ ] `client/app/containers/Order/Customer.js`
- [ ] `client/app/components/Manager/OrderList/index.js`

#### User Components
- [ ] `client/app/containers/Users/List.js`
- [ ] `client/app/components/Manager/UserList/index.js`

#### Address Components
- [ ] `client/app/containers/Address/Add.js`
- [ ] `client/app/containers/Address/Edit.js`
- [ ] `client/app/containers/Address/List.js`

#### Cart Components
- [ ] `client/app/containers/Cart/index.js`
- [ ] `client/app/components/Store/CartList/index.js`
- [ ] `client/app/components/Store/CartSummary/index.js`

#### Shop Components
- [ ] `client/app/containers/Shop/index.js`
- [ ] `client/app/components/Store/ProductList/index.js`
- [ ] `client/app/components/Store/ProductFilter/index.js`

#### Homepage Components
- [ ] `client/app/containers/Homepage/index.js`

## Cách cập nhật

### Bước 1: Import file ngôn ngữ
```javascript
import { VI } from '../../constants/vi';
```

### Bước 2: Thay thế text cứng bằng key từ file ngôn ngữ
```javascript
// Trước
<h1>Welcome</h1>
<Button text="Submit" />

// Sau
<h1>{VI['Welcome']}</h1>
<Button text={VI['Submit']} />
```

### Bước 3: Cập nhật placeholder và label
```javascript
// Trước
<Input 
  label="Name"
  placeholder="Enter your name"
/>

// Sau
<Input 
  label={VI['Name']}
  placeholder={VI['Your Full Name']}
/>
```

### Bước 4: Cập nhật error messages
```javascript
// Trước
<NotFound message="No products found." />

// Sau
<NotFound message={VI['No products found.']} />
```

## Các text phổ biến cần thay thế

### Buttons
- "Submit" → `VI['Submit']`
- "Cancel" → `VI['Cancel']`
- "Add" → `VI['Add']`
- "Edit" → `VI['Edit']`
- "Delete" → `VI['Delete']`
- "Save" → `VI['Save']`
- "Update" → `VI['Update']`

### Form Labels
- "Name" → `VI['Name']`
- "Email Address" → `VI['Email Address']`
- "Password" → `VI['Password']`
- "Description" → `VI['Description']`
- "Price" → `VI['Price']`
- "Quantity" → `VI['Quantity']`

### Messages
- "No products found." → `VI['No products found.']`
- "No categories found." → `VI['No categories found.']`
- "No orders found." → `VI['No orders found.']`

### Status
- "Processing" → `VI['Processing']`
- "Shipped" → `VI['Shipped']`
- "Delivered" → `VI['Delivered']`
- "Cancelled" → `VI['Cancelled']`

## Lưu ý quan trọng

1. **Kiểm tra context**: Một số text có thể cần context cụ thể, hãy thêm vào file `vi.js` nếu cần
2. **Validation messages**: Cập nhật các thông báo lỗi validation
3. **Success messages**: Cập nhật các thông báo thành công
4. **Tooltips**: Cập nhật tooltip text
5. **Page titles**: Cập nhật title của các trang

## Kiểm tra sau khi cập nhật

1. Chạy ứng dụng và kiểm tra từng trang
2. Kiểm tra các form validation
3. Kiểm tra error messages
4. Kiểm tra success messages
5. Kiểm tra responsive design

## Thêm text mới vào file vi.js

Nếu gặp text chưa có trong file `vi.js`, hãy thêm vào:

```javascript
export const VI = {
  // ... existing translations
  
  // Thêm text mới
  'New Text': 'Văn bản mới',
  'Another Text': 'Văn bản khác'
};
``` 