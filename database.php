<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'pokemon_db');
define('DB_USER', 'root');
define('DB_PASS', '');

try{
    $connectionString = 'mysql:host=' . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($connectionString, DB_USER,DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);


} catch (PDOException $e){

    die("database failed to connect" . $e->getMessage());
}


?>