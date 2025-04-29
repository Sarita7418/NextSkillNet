<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function testRequest()
    {
        // Obtener todos los usuarios de la tabla 'usuarios'
        $users = User::all();  // Recupera todos los usuarios de la tabla

        // Verificar si se encontraron usuarios
        if ($users->isNotEmpty()) {
            // Crear un array con los nombres de los usuarios
            $userNames = $users->pluck('nombre');  // Extrae solo los nombres

            // Convertir los nombres en una cadena separada por comas
            $userNamesString = $userNames->implode(', ');

            // Devolver los nombres en el mensaje
            return response()->json([
                'message' => 'Solicitud recibida correctamente. Usuarios encontrados: ' . $userNamesString,
            ]);
        }

        // Si no se encuentran usuarios
        return response()->json(['message' => 'No se encontraron usuarios'], 404);
    }

    // Método de login
    public function login(Request $request)
    {
        // Validación de los datos
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'contraseña' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Datos incorrectos', 'message' => $validator->errors()], 400);
        }

        // Obtener todos los usuarios
        $users = \App\Models\User::all();

        // Buscar el usuario y verificar la contraseña
        foreach ($users as $user) {
            if ($user->nombre === $request->nombre && $user->contraseña === $request->contraseña) {
                return response()->json([
                    'message' => 'Login exitoso',
                    'user' => $user,
                ]);
            }
        }

        // Si no se encuentra el usuario o las credenciales no coinciden
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    public function register(Request $request)
{
    // Recupera los datos del formulario
    $nombre = $request->input('nombre');
    $apellido = $request->input('apellido');
    $fecha_nacimiento = $request->input('fecha_nacimiento');
    $genero = $request->input('genero');
    $estado_civil = $request->input('estado_civil');
    $correo = $request->input('correo');
    $contraseña = $request->input('contraseña'); // No se encriptará

    // Inserta los datos en la base de datos
    $user = new \App\Models\User();
    $user->nombre = $nombre;
    $user->apellido = $apellido;
    $user->fecha_nacimiento = $fecha_nacimiento;
    $user->genero = $genero;
    $user->estado_civil = $estado_civil;
    $user->correo = $correo;
    $user->contraseña = $contraseña;  // Aquí no hacemos encriptación
    $user->save();

    // Retorna una respuesta indicando éxito
    return response()->json(['message' => 'Usuario registrado correctamente'], 201);
}



}
