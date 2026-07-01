<?php
header("Content-Type: application/json");
require_once "database.php";

$name = $_GET["name"];

$stmt = $pdo->prepare("
    SELECT p.id, p.name, p.type1, p.type2, pp.current_hp,
           pp.attack, pp.defense, pp.speed, p.image_path
    FROM players pl
    JOIN player_pokemon pp ON pl.id = pp.player_id
    JOIN pokemon p ON p.id = pp.pokemon_id
    WHERE pl.name = ?
");
$stmt->execute([$name]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>