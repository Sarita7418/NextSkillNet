<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class DocumentoController extends Controller
{
    public function upload(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $request->validate([
            'documento' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png|max:10240',
            'id_tipoDocumento' => 'required|integer',
        ]);

        $file = $request->file('documento');
        $path = $file->store('documentos', 'public');
        $nombreOriginal = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());

        $formato = match ($extension) {
            'pdf' => 1,
            'doc', 'docx' => 2,
            'xls', 'xlsx' => 3,
            'ppt', 'pptx' => 4,
            'jpg', 'jpeg', 'png' => 5,
            default => 6,
        };

        $id_documento = DB::table('documentos')->insertGetId([
            'recurso' => $path,
            'id_persona' => $user->id,
            'id_tipoDocumento' => $request->id_tipoDocumento,
            'id_formatoDocumento' => $formato,
            'fecha_hor_carga' => now(),
            'estado' => 'activo',
        ]);

        return response()->json([
            'message' => 'Archivo subido con éxito',
            'id_documento' => $id_documento,
            'nombre' => $nombreOriginal,
            'formato' => $extension,
            'url' => $path,
        ]);
    }


    public function listarPorUsuario($id_persona)
    {
        $documentos = DB::table('documentos')
            ->where('id_persona', $id_persona)
            ->where('estado', 'activo')
            ->get();

        return response()->json(['documentos' => $documentos]);
    }

    public function eliminar($id)
    {
        DB::table('documentos')->where('id_documento', $id)->update([
            'estado' => 'inactivo'
        ]);

        return response()->json(['message' => 'Documento eliminado']);
    }
}