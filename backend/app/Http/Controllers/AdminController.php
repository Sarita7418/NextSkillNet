<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Listar usuarios con su información relevante
   public function listarUsuarios()
{
    try {
        $usuarios = DB::select('
            SELECT 
                u.id_usuario,
                p.nombre,
                p.apellido,
                c.descripcion AS correo,
                p.estado_empleado,
                r.descripcion_roles AS rol
            FROM usuarios u
            INNER JOIN personas p ON u.id_persona = p.id_persona
            INNER JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN correo c ON c.id_persona = p.id_persona
        ');

        return response()->json($usuarios, 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al obtener usuarios',
            'mensaje' => $e->getMessage()
        ], 500);
    }
}

}
