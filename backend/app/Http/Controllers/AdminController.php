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

    // Eliminar un usuario (persona + correos + cuenta)

    public function eliminarUsuario($id)
    {
        try {
            // 1) Eliminar correos asociados a esta persona
            DB::table('correo')
                ->where('id_persona', $id)
                ->delete();

            // 2) Eliminar el registro de usuarios que tenga este id_persona
            DB::table('usuarios')
                ->where('id_persona', $id)
                ->delete();

            // 3) Eliminar la persona de la tabla personas
            $deleted = DB::table('personas')
                ->where('id_persona', $id)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'message' => 'Usuario (persona + correos + cuenta) eliminado correctamente'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'No se encontró la persona con id = ' . $id
                ], 404);
            }
        } catch (\Exception $e) {
            // Si ocurre un error (por ejemplo, integridad referencial o conexión), devolvemos status 500
            return response()->json([
                'error' => 'Error al eliminar usuario',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }

}
