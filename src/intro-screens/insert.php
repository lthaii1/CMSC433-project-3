<?php

require_once "../../database.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["playerName"];

$sql = "INSERT INTO players (name) VALUES ('$name')";

$pdo->exec($sql);


?>