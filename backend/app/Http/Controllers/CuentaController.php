<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CuentaController extends Controller
{
    // Obtener áreas (subdominios con idPadre para áreas, por ejemplo 8 si es esa)
    public function getAreas()
    {
        $idPadreAreas = 8; // Ajusta según tu tabla subdominios
        $areas = DB::table('subdominios')->where('idPadre', $idPadreAreas)->get();
        return response()->json($areas);
    }

    // Obtener países (politicos_ubicacion donde idPadre es NULL)
    // Este método debe devolver SOLO los países
    public function getPaises()
{
    $paises = DB::table('politicos_ubicacion')
                ->where('tipo', '=', 'Pais') // <-- La clave es filtrar por tipo 'Pais'
                ->select('id', 'descripcion')
                ->get();
    return response()->json($paises);
}

    // Obtener ciudades por país (idPadre = $idPais)
    // Este método recibe el ID de un país y devuelve SOLO sus ciudades
    public function getCiudades($idPais)
{
    $ciudades = DB::table('politicos_ubicacion')
                  ->where('tipo', '=', 'Ciudad') // Filtramos por tipo 'Ciudad'
                  ->where('idPadre', '=', $idPais) // Y que pertenezcan al país seleccionado
                  ->select('id', 'descripcion')
                  ->get();
    return response()->json($ciudades);
}

    // Solicitar representante
    public function solicitarRepresentante(Request $request) {
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

    // Insertar empresa primero
    $id_empresa = DB::table('empresa')->insertGetId([
        'nombre' => $request->nombre_empresa,
        'id_area' => $request->id_area,
        'id_ciudad' => $request->id_ciudad,
    ]);

    if (!$id_empresa) {
        return response()->json(['message' => 'Error al crear la empresa'], 500);
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
    $id_persona = DB::table('usuarios')->where('id_usuario', $request->id_usuario)->value('id_persona');

    if (!$id_persona) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    // Insertar la empresa
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
