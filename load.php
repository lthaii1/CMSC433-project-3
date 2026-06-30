<?php

require_once "database.php";

//pull players name
//cords
//map
$playerName = $_GET["playerName"];

$sql = "SELECT * FROM players WHERE name =:playerName";

$pdo->query($sql);

$save = $stmt->fetch(PDO::FETCH_ASSOC);

?>