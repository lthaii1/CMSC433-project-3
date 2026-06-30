<?php

require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);

$sql = "UPDATE players
        SET current_map = {$data['map']}, 
        coord_x = {$data['x']}, 
        coord_y = {$data['y']}
        WHERE name = '{$data['playerName']}'";

$pdo->exec($sql);


?>