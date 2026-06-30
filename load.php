<?php

require_once "database.php";

$playerName = $_GET["playerName"];

$sql = "SELECT * FROM players WHERE name = '$playerName'";

$stmt = $pdo->query($sql);

$save = $stmt->fetch(PDO::FETCH_ASSOC);

header("Content-Type: application/json");
echo json_encode($save);

?>