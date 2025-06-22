<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Chi tiết sản phẩm</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .product-image {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .product-detail {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1>Chi tiết sản phẩm</h1>
                    <a href="{{ route('admin.products.index') }}" class="btn btn-outline-secondary">
                        ← Quay lại danh sách
                    </a>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="product-detail">
                            <img 
                                src="{{ $product->image_url ? $product->image_url : '/images/placeholder-image.png' }}" 
                                alt="{{ $product->name }}"
                                class="product-image w-100"
                                onerror="this.src='/images/placeholder-image.png'"
                            >
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="product-detail">
                            <h2 class="mb-3">{{ $product->name }}</h2>
                            
                            <div class="row mb-3">
                                <div class="col-6">
                                    <strong>SKU:</strong>
                                    <p>{{ $product->sku ?: 'N/A' }}</p>
                                </div>
                                <div class="col-6">
                                    <strong>Slug:</strong>
                                    <p>{{ $product->slug }}</p>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-6">
                                    <strong>Giá:</strong>
                                    <p class="text-success fw-bold">${{ number_format($product->price, 2) }}</p>
                                </div>
                                <div class="col-6">
                                    <strong>Số lượng:</strong>
                                    <p>{{ $product->quantity }}</p>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-6">
                                    <strong>Trạng thái:</strong>
                                    <span class="badge bg-{{ $product->is_active ? 'success' : 'secondary' }}">
                                        {{ $product->is_active ? 'Hoạt động' : 'Không hoạt động' }}
                                    </span>
                                </div>
                                <div class="col-6">
                                    <strong>Thuế:</strong>
                                    <span class="badge bg-{{ $product->taxable ? 'warning' : 'info' }}">
                                        {{ $product->taxable ? 'Có thuế' : 'Không thuế' }}
                                    </span>
                                </div>
                            </div>
                            
                            @if($product->brand)
                            <div class="mb-3">
                                <strong>Thương hiệu:</strong>
                                <p>{{ $product->brand->name }}</p>
                            </div>
                            @endif
                            
                            @if($product->category)
                            <div class="mb-3">
                                <strong>Danh mục:</strong>
                                <p>{{ $product->category->name }}</p>
                            </div>
                            @endif
                            
                            @if($product->merchant)
                            <div class="mb-3">
                                <strong>Người bán:</strong>
                                <p>{{ $product->merchant->name }}</p>
                            </div>
                            @endif
                            
                            <div class="mb-3">
                                <strong>Mô tả:</strong>
                                <p>{{ $product->description ?: 'Không có mô tả' }}</p>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-6">
                                    <strong>Ngày tạo:</strong>
                                    <p>{{ $product->created_at->format('d/m/Y H:i') }}</p>
                                </div>
                                <div class="col-6">
                                    <strong>Cập nhật:</strong>
                                    <p>{{ $product->updated_at->format('d/m/Y H:i') }}</p>
                                </div>
                            </div>
                            
                            @if($product->image_url)
                            <div class="mb-3">
                                <strong>URL hình ảnh:</strong>
                                <p class="small text-break">{{ $product->image_url }}</p>
                            </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 