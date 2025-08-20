#!/bin/bash

echo "Thay thế tất cả VI constants còn lại trong các file..."

# Thay thế tất cả các tham chiếu VI có thể có
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Name'\]/\"Tên\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Email Address'\]/\"Địa chỉ email\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Message'\]/\"Tin nhắn\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Submit'\]/\"Gửi\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Your Full Name'\]/\"Họ và tên của bạn\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Your Email Address'\]/\"Địa chỉ email của bạn\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Please Describe Your Message'\]/\"Vui lòng mô tả tin nhắn của bạn\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Address'\]/\"Địa chỉ\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Add Address'\]/\"Thêm địa chỉ\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Default Delivery Address'\]/\"Địa chỉ giao hàng mặc định\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['City'\]/\"Thành phố\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['State'\]/\"Tỉnh\/Bang\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Country'\]/\"Quốc gia\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Zip Code'\]/\"Mã bưu điện\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Set as default'\]/\"Đặt làm mặc định\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Save'\]/\"Lưu\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Delete'\]/\"Xóa\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Status'\]/\"Trạng thái\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Order ID'\]/\"Mã đơn hàng\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Order Date'\]/\"Ngày đặt hàng\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Total'\]/\"Tổng tiền\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Account Security'\]/\"Bảo mật tài khoản\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Change Password'\]/\"Đổi mật khẩu\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Subscribe'\]/\"Đăng ký\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Users'\]/\"Người dùng\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['No users found.'\]/\"Không tìm thấy người dùng.\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Add Category'\]/\"Thêm danh mục\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Edit Category'\]/\"Chỉnh sửa danh mục\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Categories'\]/\"Danh mục\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Cancel'\]/\"Hủy\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['No categories found.'\]/\"Không tìm thấy danh mục.\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Add Product'\]/\"Thêm sản phẩm\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Edit Product'\]/\"Chỉnh sửa sản phẩm\"/g" {} \;

# Navigation specific
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Search Products'\]/\"Tìm kiếm sản phẩm\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Free Shipping'\]/\"Miễn phí vận chuyển\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Payment Methods'\]/\"Phương thức thanh toán\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Call us'\]/\"Gọi cho chúng tôi\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Need advice? Call us'\]/\"Cần tư vấn? Gọi cho chúng tôi\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Book Store'\]/\"Cần Thơ Store\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['MERN Store'\]/\"Cần Thơ Store\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Dashboard'\]/\"Bảng điều khiển\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Sign Out'\]/\"Đăng xuất\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Login'\]/\"Đăng nhập\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\['Sign Up'\]/\"Đăng ký\"/g" {} \;

# Thay thế các tham chiếu sử dụng dot notation
find client/app -name "*.js" -type f -exec sed -i "s/VI\.Login/\"Đăng nhập\"/g" {} \;
find client/app -name "*.js" -type f -exec sed -i "s/VI\.Password/\"Mật khẩu\"/g" {} \;

echo "Hoàn thành thay thế tất cả VI constants còn lại!"
