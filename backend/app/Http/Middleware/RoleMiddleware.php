<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }
        $userRole = strtoupper(trim($request->user()->role));
        // Nếu role trong DB là 'ROLE ADMIN', 'ROLE MEMBER', ... thì bỏ prefix 'ROLE '
        if (strpos($userRole, 'ROLE ') === 0) {
            $userRole = trim(str_replace('ROLE ', '', $userRole));
        }
        $checkRole = strtoupper(trim($role));
        if ($userRole !== $checkRole) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }
        return $next($request);
    }
} 