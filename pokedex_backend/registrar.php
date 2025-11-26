
<?php
// registrar.php - recibe multipart/form-data, guarda imagen y registra en MySQL
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$tipo = isset($_POST['tipo']) ? trim($_POST['tipo']) : '';
$habilidad = isset($_POST['habilidad']) ? trim($_POST['habilidad']) : '';
$descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
$colorFondo = isset($_POST['colorFondo']) ? trim($_POST['colorFondo']) : null;
$colorTexto = isset($_POST['colorTexto']) ? trim($_POST['colorTexto']) : null;
$colorBorde = isset($_POST['colorBorde']) ? trim($_POST['colorBorde']) : null;

if ($nombre === '' || $tipo === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nombre y Tipo son obligatorios']);
    exit;
}

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
    $stmt = $pdo->prepare('INSERT INTO pokemons (nombre, tipo, habilidad, descripcion, imagen, colorFondo, colorTexto, colorBorde) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$nombre, $tipo, $habilidad, $descripcion, $imagenNombre, $colorFondo, $colorTexto, $colorBorde]);
    $id = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'id' => $id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
