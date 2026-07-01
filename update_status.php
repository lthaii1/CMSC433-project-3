<?php
require_once "database.php";

$playerName = $_GET["name"];
$result = $_GET["result"];

if ($result === "win") {
    $sql = "UPDATE players SET wins = wins + 1 WHERE name = ?";
} else {
    $sql = "UPDATE players SET losses = losses + 1 WHERE name = ?";
}

$stmt = $pdo->prepare($sql);
$stmt->execute([$playerName]);

echo json_encode(["status" => "success"]);
?>