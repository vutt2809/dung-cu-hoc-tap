<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        // Create 20 random orders
        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();
            $itemCount = rand(1, 5);
            $orderTotal = 0;

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'total' => 0, // Update later
                'status' => collect(['pending', 'processing', 'completed', 'cancelled'])->random(),
                'notes' => 'Giao hàng trong giờ hành chính',
                'shipping_name' => $user->first_name . ' ' . $user->last_name,
                'shipping_phone' => $user->phone_number,
                'shipping_address' => '123 Đường ABC, Quận XYZ, TP.HCM',
            ]);

            // Create Order Items
            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $itemTotal = $product->price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $quantity,
                    'total' => $itemTotal,
                ]);

                $orderTotal += $itemTotal;
            }

            // Update Order Total
            $order->update(['total' => $orderTotal]);
        }
    }
}
