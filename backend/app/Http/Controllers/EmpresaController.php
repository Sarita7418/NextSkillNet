<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmpresaController extends Controller
{
    // Eliminar representante de la empresa
public function eliminarRepresentante($id_empresa, $id_persona)
{
    try {
        // Eliminar el representante de la relación de la empresa
        $deleted = DB::table('representante_empresa')
            ->where('id_empresa', $id_empresa)
            ->where('id_persona', $id_persona)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Representante eliminado correctamente'], 200);
        } else {
            return response()->json(['message' => 'No se encontró el representante en esta empresa'], 404);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al eliminar el representante', 'mensaje' => $e->getMessage()], 500);
    }
}

// Actualizar los representantes de la empresa
public function actualizarRepresentantes(Request $request)
{
    $request->validate([
        'id_empresa' => 'required|integer',
        'representantes' => 'required|array', // Un array de ids de representantes
    ]);

    try {
        // Eliminar todos los representantes actuales de la empresa
        DB::table('representante_empresa')
            ->where('id_empresa', $request->id_empresa)
            ->delete();

        // Insertar los nuevos representantes y actualizar su rol si es necesario
        foreach ($request->representantes as $id_persona) {
            // Insertar en la tabla 'representante_empresa'
            DB::table('representante_empresa')->insert([
                'id_empresa' => $request->id_empresa,
                'id_persona' => $id_persona,
            ]);

            // Verificar si el rol ya es 3 (representante), solo actualizar si es necesario
            $usuario = DB::table('usuarios')->where('id_persona', $id_persona)->first();
            if ($usuario && $usuario->id_rol !== 3) {
                DB::table('usuarios')
                    ->where('id_persona', $id_persona)
                    ->update(['id_rol' => 3]);
            }
        }

        return response()->json(['message' => 'Representantes actualizados correctamente'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al actualizar representantes', 'mensaje' => $e->getMessage()], 500);
    }
}


}