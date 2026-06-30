<?php

require_once "database.php";

//get the name of player passed
$playerName = $_GET["playerName"];


//query all players in database where name matches
$sql = "SELECT * FROM players WHERE name = '$playerName'";

$stmt = $pdo->query($sql);

$save = $stmt->fetch(PDO::FETCH_ASSOC);

//encode back to json
//errors when you dont
header("Content-Type: application/json");
echo json_encode($save);

?>