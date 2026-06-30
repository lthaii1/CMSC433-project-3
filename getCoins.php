<?php
// getCoins.php
// Returns the current coin balance for a given player

header('Content-Type: application/json');

require 'database.php'; // gives us $pdo

$playerName = $_GET["playerName"] ?? null;

if (!$playerName) {
    echo json_encode(["success" => false, "message" => "No player name provided"]);
    exit;
}

$stmt = $pdo->prepare("SELECT currency FROM players WHERE name = ?");
$stmt->execute([$playerName]);
$player = $stmt->fetch();

if (!$player) {
    echo json_encode(["success" => false, "message" => "Player not found"]);
    exit;
}

echo json_encode(["success" => true, "currency" => $player["currency"]]);