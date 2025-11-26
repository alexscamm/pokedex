<?php
require_once __DIR__ . '/cors.php';
session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode(['logged' => true, 'id' => $_SESSION['user_id'], 'username' => $_SESSION['username'] ?? null]);
} else {
    echo json_encode(['logged' => false]);
}
?>
