<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Método de registro
    public function register(Request $request)
    {
        // Validar los datos de entrada
        

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'genero' => 'required|in:M,F',
            'estado_civil' => 'required|string|max:255',
            'correo' => 'required|email|unique:users',
            'contraseña' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Crear el usuario
        $user = User::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'genero' => $request->genero,
            'estado_civil' => $request->estado_civil,
            'correo' => $request->correo,
            'contraseña' => Hash::make($request->contraseña),  // Hash de la contraseña
        ]);

        return response()->json(['message' => 'Usuario registrado exitosamente', 'user' => $user], 201);
    }

    // Método de login
    public function login(Request $request)
    {
        // Validar los datos de entrada
        $request->validate([
            'correo' => 'required|email',
            'contraseña' => 'required|string',
        ]);

        // Buscar el usuario
        $user = User::where('correo', $request->correo)->first();

        if (!$user || !Hash::check($request->contraseña, $user->contraseña)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        // Si las credenciales son correctas, puedes devolver un token o algún mensaje de éxito
        return response()->json(['message' => 'Login exitoso', 'user' => $user]);
    }
}
