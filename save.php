<?php

require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data["playerName"];
$x = $data["x"];
$y = $data["y"];
$map = $data["map"];

$sql = "UPDATE players
        SET current_map = $map, 
        coord_x = $x, 
        coord_y = $y
        WHERE name = '$name'";

$pdo->exec($sql);


?>