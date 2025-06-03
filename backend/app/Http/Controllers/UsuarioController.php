<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    // Obtener habilidades de un usuario
    public function getHabilidades($id_usuario)
    {
        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        $habilidades = DB::table('persona_habilidades')
            ->join('subdominios', 'persona_habilidades.id_habilidad', '=', 'subdominios.id')
            ->where('persona_habilidades.id_persona', $usuario->id_persona)
            ->select('subdominios.id', 'subdominios.descripcion')
            ->get();

        return response()->json($habilidades);
    }

    // Obtener idiomas de un usuario
    public function getIdiomas($id_usuario)
    {
        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        $idiomas = DB::table('idiomas_candidato')
            ->join('subdominios', 'idiomas_candidato.id_idiomas', '=', 'subdominios.id')
            ->where('idiomas_candidato.id_persona', $usuario->id_persona)
            ->select('subdominios.id', 'subdominios.descripcion')
            ->get();

        return response()->json($idiomas);
    }

    // Guardar habilidades blandas para un usuario
    public function guardarHabilidades(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer',
            'habilidades' => 'required|array',
            'habilidades.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'message' => $validator->errors()], 400);
        }

        $usuario = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->first();
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        // Validar que todas las habilidades existen en subdominios con idPadre=10
        $validHabilidades = DB::table('subdominios')
            ->where('idPadre', 10)
            ->whereIn('id', $request->habilidades)
            ->pluck('id')
            ->toArray();

        if (count($validHabilidades) != count($request->habilidades)) {
            return response()->json(['message' => 'Algunas habilidades no son válidas'], 400);
        }

        // Transacción para borrar e insertar
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

        return response()->json(['message' => 'Habilidades actualizadas correctamente']);
    }

    // Guardar idiomas para un usuario
    public function guardarIdiomas(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|integer',
            'idiomas' => 'required|array',
            'idiomas.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos inválidos', 'message' => $validator->errors()], 400);
        }

        $usuario = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->first();
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        // Validar que todos los idiomas existen en subdominios con idPadre=2
        $validIdiomas = DB::table('subdominios')
            ->where('idPadre', 2)
            ->whereIn('id', $request->idiomas)
            ->pluck('id')
            ->toArray();

        if (count($validIdiomas) != count($request->idiomas)) {
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

        return response()->json(['message' => 'Idiomas actualizados correctamente']);
    }
}
