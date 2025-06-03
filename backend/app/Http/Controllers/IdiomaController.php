<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IdiomaController extends Controller
{
    // Listar idiomas (subdominios con idPadre correspondiente)
    public function listar()
    {
        // Asumiendo idPadre = 2 para idiomas según tu listado
        $idiomas = DB::table('subdominios')
            ->where('idPadre', 2)
            ->select('id', 'descripcion')
            ->orderBy('descripcion')
            ->get();

        return response()->json($idiomas);
    }
}
