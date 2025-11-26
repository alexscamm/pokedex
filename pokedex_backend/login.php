<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
session_start();

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son obligatorios']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $row = $stmt->fetch();
    if (!$row || !password_verify($password, $row['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
        exit;
    }

    // set session
    $_SESSION['user_id'] = $row['id'];
    $_SESSION['username'] = $username;
    echo json_encode(['success' => true, 'id' => $row['id'], 'username' => $username]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
