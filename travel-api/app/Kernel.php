
<?php// app/Http/Kernel.php

protected $middlewareGroups = [
    // ...
    'api' => [
        // ...
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        // Gunakan ini JIKA Anda yakin Laravel menyediakan bawaan ini
        \App\Http\Middleware\HandleCors::class, // (Contoh)
    ],
];