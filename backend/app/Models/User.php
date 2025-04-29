<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    // Definir la tabla 'usuarios' explícitamente
    protected $table = 'usuarios';

    // Si es necesario, también puedes definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombre', 'apellido', 'fecha_nacimiento', 'genero', 'estado_civil', 'correo', 'contraseña',
    ];
}
