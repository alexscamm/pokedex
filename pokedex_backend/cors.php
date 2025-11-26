<?php
// cors.php - centraliza cabeceras CORS y responde preflight
// Permite credenciales y origines locales (ajusta la lista si hace falta)
$allowed_local = ['http://localhost:3000', 'http://localhost'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null;
if ($origin) {
    // permitir orígenes locales
    $parsed = parse_url($origin);
    if ($parsed && isset($parsed['host']) && ($parsed['host'] === 'localhost' || in_array($origin, $allowed_local))) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // por defecto permitir el origen exacto recibido (puedes restringir aquí)
        header("Access-Control-Allow-Origin: $origin");
    }
} else {
    header('Access-Control-Allow-Origin: http://localhost:3000');
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// responder OPTIONS (preflight) inmediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>
