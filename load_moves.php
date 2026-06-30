<?php
header("Content-Type: application/json");
require_once "database.php";

// Pokémon ID passed from JS
$pokemon_id = $_GET["id"];

$stmt = $pdo->prepare("
    SELECT a.id, a.name, a.type, a.power
    FROM pokemon_attacks pa
    JOIN attacks a ON pa.attack_id = a.id
    WHERE pa.pokemon_id = ?
");
$stmt->execute([$pokemon_id]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>