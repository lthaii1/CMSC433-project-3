<?php

require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);

$cordX = $data["MoveX"];
$cordY = $data["MoveX"];
$currMap = $data["currMap"];

$sql = "";

$pdo->exec($sql);


?>