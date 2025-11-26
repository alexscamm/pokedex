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

$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : null;
$tipo = isset($_POST['tipo']) ? trim($_POST['tipo']) : null;
$habilidad = isset($_POST['habilidad']) ? trim($_POST['habilidad']) : null;
$descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : null;
$colorFondo = isset($_POST['colorFondo']) ? trim($_POST['colorFondo']) : null;
$colorTexto = isset($_POST['colorTexto']) ? trim($_POST['colorTexto']) : null;
$colorBorde = isset($_POST['colorBorde']) ? trim($_POST['colorBorde']) : null;

$imagenNombre = null;
if (!empty($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);
    $fileTmp = $_FILES['imagen']['tmp_name'];
    $fileName = basename($_FILES['imagen']['name']);
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png'];
    if (!in_array($ext, $allowed)) {
        echo json_encode(['success' => false, 'message' => 'Tipo de imagen no permitido']);
        exit;
    }
    $imagenNombre = uniqid('pk_') . '.' . $ext;
    $dest = $uploadsDir . '/' . $imagenNombre;
    if (!move_uploaded_file($fileTmp, $dest)) {
        echo json_encode(['success' => false, 'message' => 'Error al mover la imagen']);
        exit;
    }
}

try {
    $fields = [];
    $params = [];
    if ($nombre !== null) { $fields[] = 'nombre = ?'; $params[] = $nombre; }
    if ($tipo !== null) { $fields[] = 'tipo = ?'; $params[] = $tipo; }
    if ($habilidad !== null) { $fields[] = 'habilidad = ?'; $params[] = $habilidad; }
    if ($descripcion !== null) { $fields[] = 'descripcion = ?'; $params[] = $descripcion; }
    if ($colorFondo !== null) { $fields[] = 'colorFondo = ?'; $params[] = $colorFondo; }
    if ($colorTexto !== null) { $fields[] = 'colorTexto = ?'; $params[] = $colorTexto; }
    if ($colorBorde !== null) { $fields[] = 'colorBorde = ?'; $params[] = $colorBorde; }
    if ($imagenNombre !== null) { $fields[] = 'imagen = ?'; $params[] = $imagenNombre; }

    if (count($fields) === 0) {
        echo json_encode(['success' => false, 'message' => 'Nada para actualizar']);
        exit;
    }

    $params[] = $id;
    $sql = 'UPDATE pokemons SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
