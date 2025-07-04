<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{

    public function crearChat(Request $request)
{
    // Validar que los parámetros necesarios estén presentes
    $request->validate([
        'id_rep_empresa' => 'required|integer|exists:representante_empresa,id_rep_empresa', // ID del representante
        'id_persona_contactada' => 'required|integer|exists:personas,id_persona', // ID de la persona a contactar
    ]);

    try {
        // Insertar un nuevo chat en la base de datos
        $chatId = DB::table('chat')->insertGetId([
            'id_rep_empresa' => $request->id_rep_empresa, // ID del representante
            'id_persona' => $request->id_persona_contactada, // ID de la persona a contactar
            'fecha_hor_creacion' => now(),
        ]);

        return response()->json([
            'message' => 'Chat creado correctamente',
            'chat_id' => $chatId,
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al crear el chat',
            'mensaje' => $e->getMessage(),
        ], 500);
    }
}

// AdminController.php

// AdminController.php

public function obtenerRepresentanteEmpresa($id_persona)
{
    try {
        // Primero obtenemos el id_rep_empresa correspondiente a esta persona
        $representante = DB::table('representante_empresa')
            ->where('representante_empresa.id_persona', $id_persona)
            ->join('personas', 'representante_empresa.id_persona', '=', 'personas.id_persona')
            ->select('representante_empresa.id_rep_empresa', 'personas.id_persona', 'personas.nombre', 'personas.apellido', 'personas.estado_empleado')
            ->first();

        if (!$representante) {
            return response()->json([
                'message' => 'Representante no encontrado para esta persona',
            ], 404);
        }

        // Si el id_rep_empresa se encuentra, se devuelve el detalle de la empresa y del representante
        return response()->json($representante, 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al obtener representante',
            'mensaje' => $e->getMessage(),
        ], 500);
    }
}


    //Añadir empresa
    public function anadirEmpresa($request)
    {
        $nombre = $request->input('nombre');
        $id_area = $request->input('id_area');
        $id_ciudad = $request->input('id_ciudad');

        // Validación simple
        if (!$nombre || !$id_area || !$id_ciudad) {
            return response()->json([
                'success' => false,
                'message' => 'Faltan datos obligatorios'
            ], 400);
        }

        // Verifica que no exista otra empresa con el mismo nombre
        $existe = \DB::table('empresa')->where('nombre', $nombre)->exists();
        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Ya existe una empresa con ese nombre'
            ], 409);
        }

        // Insertar en la tabla empresa
        $id = \DB::table('empresa')->insertGetId([
            'nombre' => $nombre,
            'id_area' => $id_area,
            'id_ciudad' => $id_ciudad,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Empresa registrada correctamente',
            'id_empresa' => $id
        ]);
    }


    //Listar Empresas
    public function listarEmpresasConRepresentantes()
    {
        // Obtenemos la info básica de empresas + área + ciudad + representantes
        $registros = DB::table('empresa')
            ->leftJoin('subdominios', 'empresa.id_area', '=', 'subdominios.id')
            ->leftJoin('politicos_ubicacion', 'empresa.id_ciudad', '=', 'politicos_ubicacion.id')
            ->leftJoin('representante_empresa', 'empresa.id_empresa', '=', 'representante_empresa.id_empresa')
            ->leftJoin('personas', 'representante_empresa.id_persona', '=', 'personas.id_persona')
            ->select(
                'empresa.id_empresa',
                'empresa.nombre as empresa',
                'subdominios.descripcion as area',
                'politicos_ubicacion.descripcion as ciudad',
                'personas.id_persona',
                'personas.nombre as nombre_representante',
                'personas.apellido as apellido_representante'
            )
            ->get();

        // Agrupamos por empresa, colocando un array de representantes por empresa
        $empresas = [];
        foreach ($registros as $fila) {
            $id = $fila->id_empresa;
            if (!isset($empresas[$id])) {
                $empresas[$id] = [
                    'id_empresa' => $id,
                    'nombre' => $fila->empresa,
                    'area' => $fila->area,
                    'ciudad' => $fila->ciudad,
                    'representantes' => []
                ];
            }
            // Si hay representante
            if ($fila->id_persona) {
                $empresas[$id]['representantes'][] = [
                    'id_persona' => $fila->id_persona,
                    'nombre' => $fila->nombre_representante,
                    'apellido' => $fila->apellido_representante
                ];
            }
        }

        // Reindexar a array simple
        $empresas = array_values($empresas);

        return response()->json($empresas);
    }
    //Actualizar Empresa


    public function actualizarEmpresa(Request $request)
    {
        $id_empresa = $request->input('id_empresa');
        $nombre = $request->input('nombre');
        $id_area = $request->input('id_area');
        $id_ciudad = $request->input('id_ciudad');
        $id_persona = $request->input('id_persona'); // <-- puede venir o no

        // 1. Actualizar datos de la empresa
        $actualizados = DB::table('empresa')
            ->where('id_empresa', $id_empresa)
            ->update([
                'nombre' => $nombre,
                'id_area' => $id_area,
                'id_ciudad' => $id_ciudad,
            ]);

        // 2. Si NO viene id_persona, solo retorna
        if (!$id_persona) {
            return response()->json([
                'message' => 'Empresa actualizada',
                'empresa_actualizada' => $actualizados
            ], 200);
        }

        // 3. Verificar si existe relación representante-empresa
        $relacion = DB::table('representante_empresa')
            ->where('id_empresa', $id_empresa)
            ->where('id_persona', $id_persona)
            ->first();

        if ($relacion) {
            return response()->json([
                'message' => 'Representante ya relacionado con la empresa.',
                'empresa_actualizada' => $actualizados
            ], 200);
        }

        // 4. Crear nueva relación en representante_empresa
        DB::table('representante_empresa')->insert([
            'id_empresa' => $id_empresa,
            'id_persona' => $id_persona
        ]);

        // 5. Actualizar el rol del usuario correspondiente
        $usuario = DB::table('usuarios')
            ->where('id_persona', $id_persona)
            ->first();

        if ($usuario) {
            DB::table('usuarios')
                ->where('id_usuario', $usuario->id_usuario)
                ->update(['id_rol' => 3]);
        }

        return response()->json([
            'message' => 'Empresa actualizada y representante vinculado correctamente.',
            'empresa_actualizada' => $actualizados
        ], 200);
    }


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
            // 1) Eliminar registros asociados a esta persona en las tablas relacionadas
            DB::table('documentos')
                ->where('id_persona', $id)
                ->delete();

            DB::table('idiomas_candidato')
                ->where('id_persona', $id)
                ->delete();

            DB::table('persona_habilidades')
                ->where('id_persona', $id)
                ->delete();

            DB::table('educacion')
                ->where('id_persona', $id)
                ->delete();

            DB::table('exp_laboral')
                ->where('id_persona', $id)
                ->delete();

            DB::table('mensajes')
                ->where('id_emisor', $id)
                ->delete();

            DB::table('usuarios')
                ->where('id_persona', $id)
                ->delete();

            DB::table('representante_empresa')
                ->where('id_persona', $id)
                ->delete();

            DB::table('correo')
                ->where('id_persona', $id)
                ->delete();

            // 2) Eliminar la persona de la tabla 'personas'
            $deleted = DB::table('personas')
                ->where('id_persona', $id)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'message' => 'Usuario (persona + correos + cuenta + representantes + documentos + etc.) eliminado correctamente'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'No se encontró la persona con id = ' . $id
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar usuario',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }



    //Aprobacion
    public function aprobarRepresentante(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'aprobacion' => 'required|in:0,1'
        ]);

        $id_usuario = $request->input('id_usuario');
        $aprobacion = $request->input('aprobacion');

        // Si aprobacion es 1, ponemos el rol 3 (Representante Empresa)
        // Si es 0, ponemos el rol 1 (Postulante)
        $nuevo_rol = $aprobacion == 1 ? 3 : 1;

        $updated = DB::table('usuarios')
            ->where('id_usuario', $id_usuario)
            ->update(['id_rol' => $nuevo_rol]);

        if ($updated) {
            return response()->json([
                'message' => 'Rol actualizado correctamente',
                'id_usuario' => $id_usuario,
                'nuevo_rol' => $nuevo_rol
            ]);
        } else {
            return response()->json([
                'message' => 'No se pudo actualizar el rol o el usuario no existe'
            ], 404);
        }
    }


}
