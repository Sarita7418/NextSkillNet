<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Phpml\Classification\KNearestNeighbors;
use Phpml\Dataset\CsvDataset;
use App\Http\Controllers\CandidatoController; // Asegúrate de que esta línea esté

class RecomendacionController extends Controller
{
    public function obtenerRecomendaciones(Request $request)
    {
        try {
            $request->validate([
                'habilidades' => 'required|array',
                'habilidades.*' => 'string',
            ]);

            $habilidadesRequeridas = $request->input('habilidades');
            $datasetPath = storage_path('app/onet_skills.csv');

            if (!file_exists($datasetPath)) {
                return response()->json(['error' => 'El archivo del dataset no se encuentra en storage/app/onet_skills.csv'], 500);
            }

            // --- CORRECCIÓN CRÍTICA ---
            // Reemplaza el '50' con tu número real de columnas de habilidades en abilities.csv
            $numeroDeHabilidades = 80; // <-- ¡AJUSTA ESTE NÚMERO!
            $dataset = new CsvDataset($datasetPath, $numeroDeHabilidades, true);

            $muestras = $dataset->getSamples();
            $etiquetas = $dataset->getTargets(); // user_id
            $columnasHeader = $dataset->getColumnNames();
            
            if (empty($muestras)) {
                 return response()->json(['error' => 'El dataset está vacío o no se pudo leer correctamente.'], 500);
            }

            $clasificador = new KNearestNeighbors($k = 3);
            $clasificador->train($muestras, $etiquetas);

            $vectorBusqueda = array_fill(0, count($columnasHeader), 0);
            foreach ($habilidadesRequeridas as $habilidad) {
                $nombreColumna = 'skill_' . $habilidad;
                $indice = array_search($nombreColumna, $columnasHeader);
                if ($indice !== false) {
                    $vectorBusqueda[$indice] = 1;
                }
            }
            
            $idsRecomendados = $clasificador->predict($vectorBusqueda);
            
            // --- MEJORA DE EFICIENCIA ---
            // Buscamos los perfiles completos de los IDs recomendados
            $candidatoController = new CandidatoController();
            $todosLosCandidatos = $candidatoController->obtenerPerfilesDeCandidatos();
            
            $perfilesRecomendados = [];
            // Usamos un mapa para una búsqueda más rápida
            $mapaCandidatos = [];
            foreach ($todosLosCandidatos as $candidato) {
                $mapaCandidatos[$candidato->id] = $candidato;
            }

            // Filtramos para obtener solo los recomendados y mantener el orden de k-NN
            foreach ($idsRecomendados as $id) {
                if (isset($mapaCandidatos[$id])) {
                    $perfilesRecomendados[] = $mapaCandidatos[$id];
                }
            }

            return response()->json([
                'message' => 'Recomendaciones generadas con k-NN.',
                'recomendaciones' => $perfilesRecomendados // Devolvemos los perfiles completos
            ]);

        } catch (\Exception $e) {
            // Devolvemos un error más detallado para facilitar la depuración
            return response()->json([
                'error' => 'Ocurrió un error al procesar las recomendaciones.',
                'mensaje' => $e->getMessage(),
                'linea' => $e->getLine(),
            ], 500);
        }
    }
}