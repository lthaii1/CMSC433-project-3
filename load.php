<?php

require_once "database.php";

//pull players name
//cords
//map

$sql = "SELECT * FROM users WHERE  
VALUES ('$playerName', '$cordX', '$cordY', '$mapNum')";

$pdo->exec($sql);

?>