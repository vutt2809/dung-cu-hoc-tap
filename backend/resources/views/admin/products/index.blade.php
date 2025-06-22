<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Danh sách sản phẩm</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
        .product-card {
            transition: transform 0.2s;
        }
        .product-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h1 class="mb-4">Quản lý sản phẩm</h1>
                
                <div class="row">
                    @foreach($products as $product)
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card product-card h-100">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <img 
                                        src="{{ $product->image_url ? $product->image_url : '/images/placeholder-image.png' }}" 
                                        alt="{{ $product->name }}"
                                        class="product-image me-3"
                                        onerror="this.src='/images/placeholder-image.png'"
                                    >
                                    <div class="flex-grow-1">
                                        <h5 class="card-title mb-1">{{ $product->name }}</h5>
                                        <p class="card-text text-muted small mb-1">SKU: {{ $product->sku }}</p>
                                        <p class="card-text text-success fw-bold">${{ number_format($product->price, 2) }}</p>
                                    </div>
                                </div>
                                
                                <p class="card-text small">{{ Str::limit($product->description, 100) }}</p>
                                
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="badge bg-{{ $product->is_active ? 'success' : 'secondary' }}">
                                        {{ $product->is_active ? 'Hoạt động' : 'Không hoạt động' }}
                                    </span>
                                    <small class="text-muted">SL: {{ $product->quantity }}</small>
                                </div>
                                
                                @if($product->brand)
                                <div class="mt-2">
                                    <small class="text-muted">Thương hiệu: {{ $product->brand->name }}</small>
                                </div>
                                @endif
                                
                                <div class="mt-3">
                                    <a href="{{ route('admin.products.show', $product->id) }}" class="btn btn-sm btn-outline-primary">
                                        Xem chi tiết
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                
                <div class="d-flex justify-content-center mt-4">
                    {{ $products->links() }}
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 