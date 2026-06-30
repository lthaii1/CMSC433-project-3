<?php
// gamble.php
// Handles a single gacha pull: checks coins, picks a random pokemon
// weighted by rarity, adds it to the player's team, returns JSON.

header('Content-Type: application/json');

require 'database.php'; // gives us $pdo, already connected

$pullCost = 10; // coins per pull

// get player name sent from the front end
$data = json_decode(file_get_contents("php://input"), true);
$playerName = $data["playerName"] ?? null;

if (!$playerName) {
    echo json_encode(["success" => false, "message" => "No player name provided"]);
    exit;
}

// look up the player
$stmt = $pdo->prepare("SELECT * FROM players WHERE name = ?");
$stmt->execute([$playerName]);
$player = $stmt->fetch();

if (!$player) {
    echo json_encode(["success" => false, "message" => "Player not found"]);
    exit;
}

// check if they have enough coins
if ($player["currency"] < $pullCost) {
    echo json_encode(["success" => false, "message" => "Not enough coins"]);
    exit;
}

// weighted rarity roll
// common 70%, rare 25%, legendary 5%
$roll = mt_rand(1, 100);
if ($roll <= 70) {
    $rarity = "common";
} elseif ($roll <= 95) {
    $rarity = "rare";
} else {
    $rarity = "legendary";
}

// pick a random pokemon of that rarity
$stmt = $pdo->prepare("SELECT * FROM pokemon WHERE rarity = ? ORDER BY RAND() LIMIT 1");
$stmt->execute([$rarity]);
$pokemon = $stmt->fetch();

// fallback in case a rarity tier is somehow empty
if (!$pokemon) {
    $stmt = $pdo->prepare("SELECT * FROM pokemon ORDER BY RAND() LIMIT 1");
    $stmt->execute();
    $pokemon = $stmt->fetch();
}

// deduct coins
$stmt = $pdo->prepare("UPDATE players SET currency = currency - ? WHERE id = ?");
$stmt->execute([$pullCost, $player["id"]]);

// add the pokemon to the player's team
// if they already own it, just skip adding a duplicate row
$stmt = $pdo->prepare("SELECT * FROM player_pokemon WHERE player_id = ? AND pokemon_id = ?");
$stmt->execute([$player["id"], $pokemon["id"]]);
$alreadyOwned = $stmt->fetch();

if (!$alreadyOwned) {
    $stmt = $pdo->prepare("INSERT INTO player_pokemon (player_id, pokemon_id, current_hp, attack, defense, speed) 
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $player["id"],
        $pokemon["id"],
        $pokemon["max_hp"],
        $pokemon["attack"],
        $pokemon["defense"],
        $pokemon["speed"]
    ]);
}

// send back the result
echo json_encode([
    "success" => true,
    "pokemon" => $pokemon,
    "alreadyOwned" => (bool)$alreadyOwned,
    "remainingCoins" => $player["currency"] - $pullCost
]);