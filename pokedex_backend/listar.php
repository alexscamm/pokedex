<?php
// listar.php - devuelve todos los pokemons en JSON
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query('SELECT id, nombre, tipo, habilidad, descripcion, imagen, colorFondo, colorTexto, colorBorde, created_at FROM pokemons ORDER BY created_at DESC');
    $rows = $stmt->fetchAll();
    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
