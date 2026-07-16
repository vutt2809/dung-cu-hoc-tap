<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getStatistics(Request $request)
    {
        $range = $request->get('range', '30days');
        
        $current_start = null;
        $current_end = Carbon::now();
        
        $prev_start = null;
        $prev_end = null;
        
        switch ($range) {
            case 'today':
                $current_start = Carbon::today();
                $prev_start = Carbon::yesterday();
                $prev_end = Carbon::yesterday()->endOfDay();
                break;
            case 'yesterday':
                $current_start = Carbon::yesterday();
                $current_end = Carbon::yesterday()->endOfDay();
                $prev_start = Carbon::yesterday()->subDay();
                $prev_end = Carbon::yesterday()->subDay()->endOfDay();
                break;
            case '7days':
                $current_start = Carbon::now()->subDays(6)->startOfDay();
                $prev_start = Carbon::now()->subDays(13)->startOfDay();
                $prev_end = Carbon::now()->subDays(7)->endOfDay();
                break;
            case 'this_month':
                $current_start = Carbon::now()->startOfMonth();
                $prev_start = Carbon::now()->subMonth()->startOfMonth();
                // Compare up to the same day of last month
                $prev_end = Carbon::now()->subMonth()->startOfMonth()->addDays(Carbon::now()->day - 1)->endOfDay();
                break;
            case 'last_month':
                $current_start = Carbon::now()->subMonth()->startOfMonth();
                $current_end = Carbon::now()->subMonth()->endOfMonth();
                $prev_start = Carbon::now()->subMonths(2)->startOfMonth();
                $prev_end = Carbon::now()->subMonths(2)->endOfMonth();
                break;
            case 'custom':
                $start_str = $request->get('start_date');
                $end_str = $request->get('end_date');
                if ($start_str && $end_str) {
                    $current_start = Carbon::parse($start_str)->startOfDay();
                    $current_end = Carbon::parse($end_str)->endOfDay();
                    
                    $diffInDays = $current_start->diffInDays($current_end) + 1;
                    $prev_start = (clone $current_start)->subDays($diffInDays);
                    $prev_end = (clone $current_start)->subSecond();
                } else {
                    $current_start = Carbon::now()->subDays(29)->startOfDay();
                    $prev_start = Carbon::now()->subDays(59)->startOfDay();
                    $prev_end = Carbon::now()->subDays(30)->endOfDay();
                }
                break;
            case '30days':
            default:
                $current_start = Carbon::now()->subDays(29)->startOfDay();
                $prev_start = Carbon::now()->subDays(59)->startOfDay();
                $prev_end = Carbon::now()->subDays(30)->endOfDay();
                break;
        }

        // Calculate statistics for current period
        $curr_revenue = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$current_start, $current_end])
            ->sum('total');

        $curr_orders = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$current_start, $current_end])
            ->count();

        $curr_aov = $curr_orders > 0 ? $curr_revenue / $curr_orders : 0;

        $curr_new_customers = User::whereIn('role', ['member', 'ROLE MEMBER'])
            ->whereBetween('created_at', [$current_start, $current_end])
            ->count();

        $curr_items_sold = OrderItem::whereHas('order', function ($q) use ($current_start, $current_end) {
                $q->where('status', '!=', 'cancelled')
                  ->whereBetween('created_at', [$current_start, $current_end]);
            })
            ->sum('quantity');

        // Calculate statistics for previous period
        $prev_revenue = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$prev_start, $prev_end])
            ->sum('total');

        $prev_orders = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$prev_start, $prev_end])
            ->count();

        $prev_aov = $prev_orders > 0 ? $prev_revenue / $prev_orders : 0;

        $prev_new_customers = User::whereIn('role', ['member', 'ROLE MEMBER'])
            ->whereBetween('created_at', [$prev_start, $prev_end])
            ->count();

        $prev_items_sold = OrderItem::whereHas('order', function ($q) use ($prev_start, $prev_end) {
                $q->where('status', '!=', 'cancelled')
                  ->whereBetween('created_at', [$prev_start, $prev_end]);
            })
            ->sum('quantity');

        // Helper to calculate percentage change
        $calc_change = function ($curr, $prev) {
            if ($prev == 0) {
                return $curr > 0 ? 100 : 0;
            }
            return round((($curr - $prev) / $prev) * 100, 1);
        };

        $summary = [
            'revenue' => [
                'current' => (float)$curr_revenue,
                'previous' => (float)$prev_revenue,
                'change' => $calc_change($curr_revenue, $prev_revenue)
            ],
            'orders' => [
                'current' => $curr_orders,
                'previous' => $prev_orders,
                'change' => $calc_change($curr_orders, $prev_orders)
            ],
            'aov' => [
                'current' => (float)$curr_aov,
                'previous' => (float)$prev_aov,
                'change' => $calc_change($curr_aov, $prev_aov)
            ],
            'new_customers' => [
                'current' => $curr_new_customers,
                'previous' => $prev_new_customers,
                'change' => $calc_change($curr_new_customers, $prev_new_customers)
            ],
            'items_sold' => [
                'current' => (int)$curr_items_sold,
                'previous' => (int)$prev_items_sold,
                'change' => $calc_change($curr_items_sold, $prev_items_sold)
            ]
        ];

        // Sales by Date (filling in empty dates to make smooth charts)
        $sales_data_db = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$current_start, $current_end])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        // Build list of dates for current period
        $sales_by_date = [];
        $temp_start = (clone $current_start)->startOfDay();
        $temp_end = (clone $current_end)->startOfDay();
        
        while ($temp_start->lte($temp_end)) {
            $date_str = $temp_start->format('Y-m-d');
            
            $db_val = $sales_data_db->get($date_str);
            $sales_by_date[] = [
                'date' => $date_str,
                'revenue' => $db_val ? (float)$db_val->revenue : 0.0,
                'orders' => $db_val ? (int)$db_val->orders : 0
            ];
            
            $temp_start->addDay();
        }

        // Top Selling Products (Top 5)
        $top_products = OrderItem::whereHas('order', function ($q) use ($current_start, $current_end) {
                $q->where('status', '!=', 'cancelled')
                  ->whereBetween('created_at', [$current_start, $current_end]);
            })
            ->select(
                'product_id',
                'product_name',
                DB::raw('SUM(quantity) as quantity_sold'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('product_id', 'product_name')
            ->orderBy('quantity_sold', 'desc')
            ->limit(5)
            ->get();

        foreach ($top_products as $item) {
            $prod = Product::find($item->product_id);
            $item->image_url = $prod ? $prod->image_url : null;
            $item->slug = $prod ? $prod->slug : null;
            $item->quantity_sold = (int)$item->quantity_sold;
            $item->revenue = (float)$item->revenue;
        }

        // Sales by Category
        $category_sales = OrderItem::whereHas('order', function ($q) use ($current_start, $current_end) {
                $q->where('status', '!=', 'cancelled')
                  ->whereBetween('created_at', [$current_start, $current_end]);
            })
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('SUM(order_items.total) as revenue'),
                DB::raw('SUM(order_items.quantity) as quantity_sold')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('revenue', 'desc')
            ->get();

        foreach ($category_sales as $item) {
            $item->revenue = (float)$item->revenue;
            $item->quantity_sold = (int)$item->quantity_sold;
        }

        // Order Status Distribution
        $order_statuses = Order::whereBetween('created_at', [$current_start, $current_end])
            ->select(
                'status',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('status')
            ->get();

        foreach ($order_statuses as $item) {
            $item->count = (int)$item->count;
            $item->revenue = (float)$item->revenue;
        }

        return response()->json([
            'success' => true,
            'summary' => $summary,
            'sales_by_date' => $sales_by_date,
            'top_products' => $top_products,
            'category_sales' => $category_sales,
            'order_statuses' => $order_statuses
        ]);
    }
}
