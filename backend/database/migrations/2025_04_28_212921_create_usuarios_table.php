<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();                      // id automático
            $table->string('nombre');           // campo nombre
            $table->string('apellido');         // campo apellido
            $table->date('fecha_nacimiento');   // fecha de nacimiento
            $table->enum('genero', ['M', 'F']); // genero M/F
            $table->string('estado_civil');     // estado civil
            $table->string('correo')->unique(); // correo único
            $table->string('contraseña');       // contraseña
            $table->timestamps();               // created_at y updated_at automáticos
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
