<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class UsuarioController extends Controller
{
    // Obtener habilidades de un usuario
    public function getHabilidades($id_usuario)
    {
        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $habilidades = DB::table('persona_habilidades')
            ->join('subdominios', 'persona_habilidades.id_habilidad', '=', 'subdominios.id')
            ->where('persona_habilidades.id_persona', $usuario->id_persona)
            ->select('subdominios.id', 'subdominios.descripcion')
            ->get();

        return response()->json($habilidades, 200);
    }

    // Obtener idiomas de un usuario
    public function getIdiomas($id_usuario)
    {
        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $idiomas = DB::table('idiomas_candidato')
            ->join('subdominios', 'idiomas_candidato.id_idiomas', '=', 'subdominios.id')
            ->where('idiomas_candidato.id_persona', $usuario->id_persona)
            ->select('subdominios.id', 'subdominios.descripcion')
            ->get();

        return response()->json($idiomas, 200);
    }

    // Guardar habilidades blandas para un usuario
    public function guardarHabilidades(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'habilidades' => 'required|array|min:1',
            'habilidades.*' => 'integer|distinct',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos inválidos',
                'messages' => $validator->errors()
            ], 422);
        }

        $usuario = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->first();

        // Validar que todas las habilidades existen en subdominios con idPadre=10
        $validHabilidades = DB::table('subdominios')
            ->where('idPadre', 10)
            ->whereIn('id', $request->habilidades)
            ->pluck('id')
            ->toArray();

        if (count($validHabilidades) !== count($request->habilidades)) {
            return response()->json(['message' => 'Algunas habilidades no son válidas'], 400);
        }

        DB::transaction(function () use ($usuario, $request) {
            // Eliminar las actuales
            DB::table('persona_habilidades')->where('id_persona', $usuario->id_persona)->delete();

            // Insertar nuevas
            $insertData = array_map(fn($id) => [
                'id_persona' => $usuario->id_persona,
                'id_habilidad' => $id,
                'observacion' => null,
            ], $request->habilidades);

            DB::table('persona_habilidades')->insert($insertData);
        });

        return response()->json(['message' => 'Habilidades actualizadas correctamente'], 200);
    }

    // Guardar idiomas para un usuario
    public function guardarIdiomas(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'idiomas' => 'required|array|min:1',
            'idiomas.*' => 'integer|distinct',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos inválidos',
                'messages' => $validator->errors()
            ], 422);
        }

        $usuario = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->first();

        // Validar que todos los idiomas existen en subdominios con idPadre=2
        $validIdiomas = DB::table('subdominios')
            ->where('idPadre', 2)
            ->whereIn('id', $request->idiomas)
            ->pluck('id')
            ->toArray();

        if (count($validIdiomas) !== count($request->idiomas)) {
            return response()->json(['message' => 'Algunos idiomas no son válidos'], 400);
        }

        DB::transaction(function () use ($usuario, $request) {
            // Eliminar actuales
            DB::table('idiomas_candidato')->where('id_persona', $usuario->id_persona)->delete();

            // Insertar nuevos
            $insertData = array_map(fn($id) => [
                'id_persona' => $usuario->id_persona,
                'id_idiomas' => $id,
            ], $request->idiomas);

            DB::table('idiomas_candidato')->insert($insertData);
        });

        return response()->json(['message' => 'Idiomas actualizados correctamente'], 200);
    }

    // Obtener experiencia laboral de un usuario
    public function getExperienciasLaborales($id_usuario)
    {
        try {
            // Buscar usuario
            $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();

            // Si no hay usuario o no tiene persona asociada, devolvemos lista vacía
            if (!$usuario || !$usuario->id_persona) {
                return response()->json([], 200);
            }

            // Obtener experiencias laborales (si existen)
            $experiencias = DB::table('exp_laboral')
                ->where('exp_laboral.id_persona', $usuario->id_persona)
                ->leftJoin('empresas', 'exp_laboral.id_empresa', '=', 'empresas.id_empresa')
                ->leftJoin('cargos', 'exp_laboral.id_cargo', '=', 'cargos.id_cargo')
                ->leftJoin('ciudades', 'exp_laboral.id_ciudad', '=', 'ciudades.id_ciudad')
                ->select(
                    'exp_laboral.id_experiencia_laboral as id',
                    'exp_laboral.fecha_in_trab as fechaInicio',
                    'exp_laboral.fecha_out_trab as fechaFin',
                    'empresas.nombre as empresa',
                    'cargos.nombre as puesto',
                    'ciudades.nombre as ubicacion',
                    'exp_laboral.descripcion'
                )
                ->orderBy('exp_laboral.fecha_in_trab', 'desc')
                ->get();

            return response()->json($experiencias, 200);

        } catch (\Throwable $e) {
            // Si ocurre un error inesperado, devolvemos lista vacía en lugar de error
            return response()->json([], 200);
        }
    }
    // Guardar experiencia laboral para un usuario
    public function storeExperienciaLaboral(Request $request, $id_usuario)
    {
        $validator = Validator::make($request->all(), [
            'id_empresa' => 'nullable|integer|exists:empresas,id_empresa',
            'id_cargo' => 'nullable|integer|exists:cargos,id_cargo',
            'id_ciudad' => 'nullable|integer|exists:ciudades,id_ciudad',
            'fechaInicio' => 'nullable|date',
            'fechaFin' => 'nullable|date|after_or_equal:fechaInicio',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos inválidos',
                'messages' => $validator->errors()
            ], 422);
        }

        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $idExperiencia = DB::table('exp_laboral')->insertGetId([
            'id_persona' => $usuario->id_persona,
            'fecha_in_trab' => $request->fechaInicio ? Carbon::parse($request->fechaInicio)->format('Y-m-d H:i:s') : null,
            'fecha_out_trab' => $request->fechaFin ? Carbon::parse($request->fechaFin)->format('Y-m-d H:i:s') : null,
            'id_empresa' => $request->id_empresa,
            'id_cargo' => $request->id_cargo,
            'id_ciudad' => $request->id_ciudad,
            'descripcion' => $request->descripcion,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $experiencia = DB::table('exp_laboral')
            ->where('id_experiencia_laboral', $idExperiencia)
            ->select('id_experiencia_laboral as id')
            ->first();

        return response()->json([
            'message' => 'Experiencia laboral añadida correctamente',
            'experiencia' => $experiencia
        ], 201);
    }


    // Actualizar experiencia laboral de un usuario
    public function updateExperienciaLaboral(Request $request, $id_usuario, $id_experiencia_laboral)
    {
        $validator = Validator::make($request->all(), [
            'id_empresa' => 'nullable|integer|exists:empresas,id_empresa',
            'id_cargo' => 'nullable|integer|exists:cargos,id_cargo',
            'id_ciudad' => 'nullable|integer|exists:ciudades,id_ciudad',
            'fechaInicio' => 'nullable|date',
            'fechaFin' => 'nullable|date|after_or_equal:fechaInicio',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos inválidos',
                'messages' => $validator->errors()
            ], 422);
        }

        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $experiencia = DB::table('exp_laboral')
            ->where('id_experiencia_laboral', $id_experiencia_laboral)
            ->where('id_persona', $usuario->id_persona)
            ->first();

        if (!$experiencia) {
            return response()->json(['message' => 'Experiencia laboral no encontrada para este usuario'], 404);
        }

        DB::table('exp_laboral')
            ->where('id_experiencia_laboral', $id_experiencia_laboral)
            ->where('id_persona', $usuario->id_persona)
            ->update([
                'fecha_in_trab' => $request->fechaInicio ? Carbon::parse($request->fechaInicio)->format('Y-m-d H:i:s') : null,
                'fecha_out_trab' => $request->fechaFin ? Carbon::parse($request->fechaFin)->format('Y-m-d H:i:s') : null,
                'id_empresa' => $request->id_empresa,
                'id_cargo' => $request->id_cargo,
                'id_ciudad' => $request->id_ciudad,
                'descripcion' => $request->descripcion,
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Experiencia laboral actualizada correctamente'], 200);
    }

    // Eliminar experiencia laboral de un usuario
    public function destroyExperienciaLaboral($id_usuario, $id_experiencia_laboral)
    {
        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $experiencia = DB::table('exp_laboral')
            ->where('id_experiencia_laboral', $id_experiencia_laboral)
            ->where('id_persona', $usuario->id_persona)
            ->first();

        if (!$experiencia) {
            return response()->json(['message' => 'Experiencia laboral no encontrada para este usuario'], 404);
        }

        DB::table('exp_laboral')
            ->where('id_experiencia_laboral', $id_experiencia_laboral)
            ->where('id_persona', $usuario->id_persona)
            ->delete();

        return response()->json(['message' => 'Experiencia laboral eliminada correctamente'], 200);
    }
}
