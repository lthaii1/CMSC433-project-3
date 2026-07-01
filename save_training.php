<?php
require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);
$name = $data["playerName"];

$update = $pdo->prepare("
    UPDATE player_pokemon pp
    JOIN players pl ON pl.id = pp.player_id
    SET pp.current_hp = ?, pp.attack = ?, pp.defense = ?, pp.speed = ?
    WHERE pl.name = ? AND pp.pokemon_id = ?
");

foreach ($data["team"] as $p) {
    $update->execute([$p["current_hp"], $p["attack"], $p["defense"], $p["speed"], $name, $p["id"]]);
}
?>