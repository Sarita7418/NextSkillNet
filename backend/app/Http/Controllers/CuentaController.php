<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CuentaController extends Controller
{

    public function eliminarEmpresa($id)
    {
        try {
            // 1) Eliminar representantes de empresa asociados
            DB::table('representante_empresa')->where('id_empresa', $id)->delete();

            // 2) Eliminar experiencias laborales asociadas
            DB::table('exp_laboral')->where('id_empresa', $id)->delete();

            // 4) Eliminar vacantes asociadas
            DB::table('vacantes')->where('id_empresa', $id)->delete();

            // 5) Eliminar horarios asociados a vacantes de la empresa
            // Primero obtenemos las vacantes asociadas
            $vacantes = DB::table('vacantes')->where('id_empresa', $id)->pluck('id_vacante');
            if ($vacantes && count($vacantes) > 0) {
                DB::table('horario')->whereIn('id_vacante', $vacantes)->delete();
            }

            // 6) Finalmente, eliminar la empresa
            $deleted = DB::table('empresa')->where('id_empresa', $id)->delete();

            if ($deleted) {
                return response()->json([
                    'message' => 'Empresa y datos relacionados eliminados correctamente'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'No se encontró la empresa con id = ' . $id
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar empresa',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }

    // Obtener áreas (subdominios con idPadre para áreas, por ejemplo 8 si es esa)
    public function getAreas()
    {
        $idPadreAreas = 8; // Ajusta según tu tabla subdominios
        $areas = DB::table('subdominios')->where('idPadre', $idPadreAreas)->get();
        return response()->json($areas);
    }

    // Obtener países (politicos_ubicacion donde idPadre es NULL)
    public function getPaises()
    {
        $paises = DB::table('politicos_ubicacion')
            ->whereNotNull('idPadre')  // Solo los que tienen un padre, es decir países
            ->get();
        return response()->json($paises);
    }

    // Obtener ciudades por país (idPadre = $idPais)
    public function getCiudades($idPais)
    {
        $ciudades = DB::table('politicos_ubicacion')->where('idPadre', $idPais)->get();
        return response()->json($ciudades);
    }

    public function solicitarRepresentante(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'nombre_empresa' => 'required|string',
            'id_area' => 'required|integer',
            'id_ciudad' => 'required|integer',
        ]);

        $id_persona = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->value('id_persona');
        if (!$id_persona) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $id_empresa = null;

        // Si el nombre_empresa es del tipo "idEmpresa=x"
        if (preg_match('/^idEmpresa=(\d+)$/', $request->nombre_empresa, $matches)) {
            $id_empresa = intval($matches[1]);
            // Verifica que la empresa realmente existe
            $empresaExiste = DB::table('empresa')->where('id_empresa', $id_empresa)->exists();
            if (!$empresaExiste) {
                return response()->json(['message' => 'La empresa indicada no existe'], 404);
            }
        } else {
            // Crear la empresa normalmente
            $id_empresa = DB::table('empresa')->insertGetId([
                'nombre' => $request->nombre_empresa,
                'id_area' => $request->id_area,
                'id_ciudad' => $request->id_ciudad,
            ]);
            if (!$id_empresa) {
                return response()->json(['message' => 'Error al crear la empresa'], 500);
            }
        }

        // Insertar representante_empresa vinculado a persona y empresa
        $inserted = DB::table('representante_empresa')->insert([
            'id_persona' => $id_persona,
            'id_empresa' => $id_empresa,
        ]);

        if ($inserted) {
            // Actualizar rol del usuario
            DB::table('usuarios')
                ->where('id_usuario', $request->id_usuario)
                ->update(['id_rol' => 4]);

            return response()->json(['message' => 'Solicitud enviada correctamente y rol actualizado']);
        } else {
            return response()->json(['message' => 'Error al guardar solicitud de representante'], 500);
        }
    }


    //Registrar empresa (sin rol, solo persona y empresa)
    public function registrarEmpresa(Request $request)
    {
        $request->validate([
            'id_persona' => 'required|integer',
            'nombre_empresa' => 'required|string',
            'id_area' => 'required|integer',
            'id_ciudad' => 'required|integer',
        ]);

        // Buscar la persona asociada al usuario
        // (Ahora usas id_persona directamente, asumes que es correcto)

        $id_persona = $request->id_persona;

        if (!$id_persona) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Si nombre_empresa es tipo "idEmpresa=x"
        if (preg_match('/^idEmpresa=(\d+)$/', $request->nombre_empresa, $match)) {
            $id_empresa = intval($match[1]);
            // Chequea si existe la empresa realmente (opcional, pero recomendado)
            $empresa = DB::table('empresa')->where('id_empresa', $id_empresa)->first();
            if (!$empresa) {
                return response()->json(['message' => 'La empresa no existe'], 404);
            }
            // Relacionar persona con empresa (no crear nueva)
            $inserted = DB::table('representante_empresa')->insert([
                'id_persona' => $id_persona,
                'id_empresa' => $id_empresa,
            ]);
            if ($inserted) {
                return response()->json(['message' => 'Representante relacionado correctamente', 'id_empresa' => $id_empresa]);
            } else {
                return response()->json(['message' => 'Error al registrar representante de empresa'], 500);
            }
        }

        // Si NO es un id, crear empresa normalmente
        $id_empresa = DB::table('empresa')->insertGetId([
            'nombre' => $request->nombre_empresa,
            'id_area' => $request->id_area,
            'id_ciudad' => $request->id_ciudad,
        ]);

        if (!$id_empresa) {
            return response()->json(['message' => 'Error al crear la empresa'], 500);
        }

        // Relacionar persona con empresa (no se toca el rol)
        $inserted = DB::table('representante_empresa')->insert([
            'id_persona' => $id_persona,
            'id_empresa' => $id_empresa,
        ]);

        if ($inserted) {
            return response()->json(['message' => 'Empresa registrada correctamente', 'id_empresa' => $id_empresa]);
        } else {
            return response()->json(['message' => 'Error al registrar representante de empresa'], 500);
        }
    }




    public function actualizarContrasena(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'contrasena' => 'required|string|min:4',
        ]);

        $updated = DB::table('usuarios')
            ->where('id_usuario', $request->id_usuario)
            ->update(['contrasena' => $request->contrasena]);

        if ($updated) {
            return response()->json(['message' => 'Contraseña actualizada correctamente']);
        } else {
            return response()->json(['message' => 'Error al actualizar contraseña'], 500);
        }
    }
}
