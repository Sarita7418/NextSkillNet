<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Permitir solicitudes desde cualquier origen
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')  // Permitir cualquier origen
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')  // Métodos permitidos
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Headers permitidos
    }
}
