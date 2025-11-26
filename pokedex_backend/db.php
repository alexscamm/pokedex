<?php
// db.php - conexión a la base de datos
header('Content-Type: application/json; charset=utf-8');

$DB_HOST = 'sql100.infinityfree.com';
$DB_NAME = 'if0_40500660_pokedex';
$DB_USER = 'if0_40500660';
$DB_PASS = 'TU_VPANEL_PASSWORD';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB connection error: ' . $e->getMessage()]);
    exit;
}

define('REACT_APP_API_BASE', 'https://pokedex.42web.io/pokedex_backend');
