<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{

    public function modificarEntrevista(Request $request, $id_chat)
{
    $fecha_hor_programada = $request->input('fecha_hor_programada');
    $direccion = $request->input('direccion');

    // Validar id_chat
    if (!is_numeric($id_chat) || intval($id_chat) <= 0) {
        return response()->json(['error' => 'ID de chat inválido'], 422);
    }

    // Validar dirección
    if (!$direccion || strlen($direccion) > 255) {
        return response()->json(['error' => 'Dirección inválida'], 422);
    }

    // Validar formato fecha/hora
    if (!$fecha_hor_programada || !preg_match('/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/', $fecha_hor_programada)) {
        return response()->json(['error' => 'Formato de fecha/hora inválido'], 422);
    }

    // Opcional: Intenta parsear a DateTime
    try {
        $fechaDT = new \DateTime($fecha_hor_programada);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Fecha/hora inválida'], 422);
    }

    // UPDATE
    $actualizados = \DB::update(
        'UPDATE entrevista SET fecha_hor_programada = ?, estado = ?, direccion = ? WHERE id_chat = ?',
        [$fechaDT->format('Y-m-d H:i:s'), null, $direccion, intval($id_chat)]
    );

    if ($actualizados === 0) {
        return response()->json(['mensaje' => 'No se encontró ninguna entrevista para actualizar'], 404);
    }

    return response()->json(['mensaje' => 'Entrevista actualizada exitosamente']);
}


   public function insertarEntrevista(Request $request, $id_chat)
{
    // Validación manual
    $fecha_hor_programada = $request->input('fecha_hor_programada');
    $direccion = $request->input('direccion');

    // Validar que id_chat sea numérico y positivo
    if (!is_numeric($id_chat) || intval($id_chat) <= 0) {
        return response()->json(['error' => 'ID de chat inválido'], 422);
    }

    // Validar dirección
    if (!$direccion || strlen($direccion) > 255) {
        return response()->json(['error' => 'Dirección inválida'], 422);
    }

    // Validar formato fecha/hora (YYYY-MM-DD HH:MM o YYYY-MM-DD HH:MM:SS)
    if (!$fecha_hor_programada || !preg_match('/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/', $fecha_hor_programada)) {
        return response()->json(['error' => 'Formato de fecha/hora inválido'], 422);
    }

    // Opcional: Intenta parsear a DateTime para asegurar validez real
    try {
        $fechaDT = new \DateTime($fecha_hor_programada);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Fecha/hora inválida'], 422);
    }

    // Inserción
    \DB::insert(
        'INSERT INTO entrevista (fecha_hor_programada, id_chat, estado, direccion) VALUES (?, ?, ?, ?)',
        [$fechaDT->format('Y-m-d H:i:s'), intval($id_chat), null, $direccion]
    );

    return response()->json(['mensaje' => 'Entrevista creada exitosamente']);
}




    public function obtenerEntrevista($id_chat)
    {
        $entrevista = DB::select('SELECT * FROM entrevista WHERE id_chat = ?', [$id_chat]);

        if (empty($entrevista)) {
            return response()->json(['mensaje' => 'Sin entrevista'], 200);
        }

        return response()->json($entrevista[0]);
    }

    public function listarChats(Request $request)
    {
        $tipo = $request->query('tipo'); // 'representante' o 'persona'
        $id_usuario = $request->query('id'); // SIEMPRE id_usuario

        if (!$tipo || !$id_usuario) {
            return response()->json(['message' => 'Faltan parámetros'], 400);
        }

        // Buscar el usuario
        $usuario = DB::table('usuarios')->where('id_usuario', $id_usuario)->first();
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $id_persona = $usuario->id_persona;

        if ($tipo === 'representante') {
            // Buscar el id_rep_empresa para este usuario/persona
            $rep = DB::table('representante_empresa')
                ->where('id_persona', $id_persona)
                ->first();

            if (!$rep) {
                return response()->json(['message' => 'No es representante'], 400);
            }

            $id_rep_empresa = $rep->id_rep_empresa;

            // Listar los chats donde el representante es el actual
            $chats = DB::table('chat')
                ->join('personas', 'chat.id_persona', '=', 'personas.id_persona')
                ->select(
                    'chat.id_chat',
                    'personas.nombre',
                    'personas.apellido'
                )
                ->where('chat.id_rep_empresa', $id_rep_empresa)
                ->get();

            $result = $chats->map(function ($chat) {
                $ultimo = DB::table('mensajes')
                    ->where('id_chat', $chat->id_chat)
                    ->orderByDesc('fecha_hor_envio')
                    ->first();

                return [
                    'id_chat' => $chat->id_chat,
                    'nombre' => $chat->nombre,
                    'apellido' => $chat->apellido,
                    'ultimo_mensaje' => $ultimo ? $ultimo->contenido : 'Sin mensajes recientes en este chat',
                    'fecha_ultimo_mensaje' => $ultimo ? $ultimo->fecha_hor_envio : null
                ];
            });

            return response()->json($result);

        } elseif ($tipo === 'persona') {
            // Listar los chats donde la persona es el actual
            $chats = DB::table('chat')
                ->join('representante_empresa', 'chat.id_rep_empresa', '=', 'representante_empresa.id_rep_empresa')
                ->join('personas as reps', 'representante_empresa.id_persona', '=', 'reps.id_persona')
                ->select(
                    'chat.id_chat',
                    'reps.nombre as nombre',
                    'reps.apellido as apellido'
                )
                ->where('chat.id_persona', $id_persona)
                ->get();

            $result = $chats->map(function ($chat) {
                $ultimo = DB::table('mensajes')
                    ->where('id_chat', $chat->id_chat)
                    ->orderByDesc('fecha_hor_envio')
                    ->first();

                return [
                    'id_chat' => $chat->id_chat,
                    'nombre' => $chat->nombre,
                    'apellido' => $chat->apellido,
                    'ultimo_mensaje' => $ultimo ? $ultimo->contenido : 'Sin mensajes recientes en este chat',
                    'fecha_ultimo_mensaje' => $ultimo ? $ultimo->fecha_hor_envio : null
                ];
            });

            return response()->json($result);

        } else {
            return response()->json(['message' => 'Tipo no válido'], 400);
        }
    }



    public function mensajesPorChat($id_chat)
    {
        if (!$id_chat) {
            return response()->json(['message' => 'Falta el id_chat'], 400);
        }

        // Traer mensajes ordenados por fecha de envío ASC (del más antiguo al más reciente)
        $mensajes = DB::table('mensajes')
            ->select('id_mensaje', 'contenido', 'fecha_hor_envio', 'id_emisor')
            ->where('id_chat', $id_chat)
            ->orderBy('fecha_hor_envio', 'asc')
            ->get();

        return response()->json($mensajes);
    }



    public function agregarMensaje(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'contenido' => 'required|string',
            'id_chat' => 'required|integer',
            'id_emisor' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos', 'errors' => $validator->errors()], 400);
        }

        $fechaAhora = now(); // Usa Carbon o DB según tu versión de Laravel

        $id_mensaje = DB::table('mensajes')->insertGetId([
            'contenido' => $request->contenido,
            'id_chat' => $request->id_chat,
            'fecha_hor_envio' => $fechaAhora,
            'fecha_hor_visto' => $fechaAhora,
            'id_emisor' => $request->id_emisor
        ]);

        // Devolver el mensaje insertado (opcional)
        $mensaje = DB::table('mensajes')
            ->select('id_mensaje', 'contenido', 'fecha_hor_envio', 'id_emisor')
            ->where('id_mensaje', $id_mensaje)
            ->first();

        return response()->json([
            'message' => 'Mensaje agregado exitosamente',
            'mensaje' => $mensaje
        ]);
    }


}