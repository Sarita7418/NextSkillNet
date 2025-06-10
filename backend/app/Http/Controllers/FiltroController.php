<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FiltroController extends Controller
{
    public function getOpciones()
    {
        try {
            $generos = DB::table('subdominios as s')
            ->join('dominios as d', 's.idPadre', '=', 'd.idPadre')
            ->where('d.descripcion', '=', 'generos')
            ->select('s.id as value', 's.descripcion as label') // Devolvemos id y descripción
            ->get();
            // Obtener Cargos/Posiciones (sin cambios)
            $posiciones = DB::table('subdominios as s')
                ->join('dominios as d', 's.idPadre', '=', 'd.idPadre')
                ->where('d.descripcion', '=', 'Cargos')
                ->select('s.descripcion as label', 's.descripcion as value')
                ->orderBy('label', 'asc')
                ->get();

            // Obtener Habilidades (sin cambios)
            $habilidades = DB::table('subdominios as s')
                ->join('dominios as d', 's.idPadre', '=', 'd.idPadre')
                ->where('d.descripcion', '=', 'Habilidades')
                ->select('s.descripcion')
                ->orderBy('descripcion', 'asc')
                ->pluck('descripcion');

            // Obtener Ubicaciones/Ciudades (sin cambios)
            $ubicaciones = DB::table('politicos_ubicacion')
                ->where('tipo', '=', 'Ciudad')
                ->select('descripcion as label', 'descripcion as value')
                ->orderBy('label', 'asc')
                ->get();
            
            // <-- CORREGIDO: Obtener Disponibilidad directamente de la tabla personas
            $disponibilidades = DB::table('personas')
                ->whereNotNull('disponibilidad')
                ->where('disponibilidad', '<>', '')
                ->select('disponibilidad as value', 
                    DB::raw("CASE disponibilidad
                                WHEN 'immediate' THEN 'Inmediata'
                                WHEN 'two-weeks' THEN 'Dos semanas'
                                WHEN 'one-month' THEN 'Un mes'
                                ELSE disponibilidad
                            END as label")
                )
                ->distinct()
                ->get();

            // Obtener Niveles de Educación (sin cambios)
            /*$educacion = DB::table('subdominios as s')
                ->join('dominios as d', 's.idPadre', '=', 'd.idPadre')
                ->where('d.descripcion', '=', 'Tipos de Grado')
                ->select('s.descripcion as label', 's.descripcion as value')
                ->orderBy('label', 'asc')
                ->get();
*/
            // Devolver todo en un solo objeto JSON
            return response()->json([
                'posiciones' => $posiciones,
                'ubicaciones' => $ubicaciones,
                'habilidades' => $habilidades,
                'disponibilidades' => $disponibilidades,
                //'educacion' => $educacion,
                'generos' => $generos,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'No se pudieron cargar las opciones de filtro',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }
}