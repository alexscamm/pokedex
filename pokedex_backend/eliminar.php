<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit;
}

try {
    // Optionally remove image file
    $stmt = $pdo->prepare('SELECT imagen FROM pokemons WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if ($row && !empty($row['imagen'])) {
        $path = __DIR__ . '/uploads/' . $row['imagen'];
        if (file_exists($path)) @unlink($path);
    }

    $del = $pdo->prepare('DELETE FROM pokemons WHERE id = ?');
    $del->execute([$id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
