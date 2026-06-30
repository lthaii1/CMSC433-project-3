<?php

require_once "database.php";

$stmt = $pdo->prepare("SELECT * FROM pokemon ORDER BY RAND() LIMIT 1");
$stmt->execute();

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
?>