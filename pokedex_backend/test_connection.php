<?php
require_once __DIR__ . '/cors.php';
try {
	$pdo = new PDO("mysql:host=127.0.0.1;dbname=pokedex;charset=utf8", "root", "");
	echo json_encode(['success' => true, 'message' => 'Conexión exitosa']);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
