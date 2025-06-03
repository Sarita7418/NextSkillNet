<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HabilidadController extends Controller
{
    // Listar habilidades blandas (subdominios con idPadre correspondiente)
    public function listar()
    {
        // Asumiendo idPadre = 10 para habilidades blandas según tu listado
        $habilidades = DB::table('subdominios')
            ->where('idPadre', 10)
            ->select('id', 'descripcion')
            ->orderBy('descripcion')
            ->get();

        return response()->json($habilidades);
    }
}
