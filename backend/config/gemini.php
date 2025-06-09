<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Gemini API Key
    |--------------------------------------------------------------------------
    |
    | Aquí se especifica la clave de API para tu proyecto de Gemini.
    | La librería leerá esta configuración, que a su vez lee la variable
    | de tu archivo .env para mantener la seguridad.
    |
    */
    'api_key' => env('GEMINI_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Organization (Opcional)
    |--------------------------------------------------------------------------
    */
    'organization' => env('GEMINI_ORGANIZATION'),
];