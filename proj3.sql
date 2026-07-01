-- ============================================================
-- proj3.sql
-- Pokemon Battle Game Database
-- CMSC 433 - Project 3
-- ============================================================

CREATE DATABASE IF NOT EXISTS pokemon_db;
USE pokemon_db;

-- ============================================================
-- TABLE 1: pokemon
-- Base pokemon data.
-- image_path uses local files: proj3_images/1st Generation/
-- rarity added for the gambling/gacha system (common, rare, legendary)
-- ============================================================

CREATE TABLE IF NOT EXISTS pokemon (
    id          INT NOT NULL,
    name        VARCHAR(50) NOT NULL,
    type1       VARCHAR(15) NOT NULL,
    type2       VARCHAR(15),
    max_hp      INT NOT NULL,
    hp          INT NOT NULL,
    attack      INT NOT NULL,
    defense     INT NOT NULL,
    speed       INT NOT NULL,
    image_path  VARCHAR(255) NOT NULL,
    rarity      VARCHAR(15) NOT NULL DEFAULT 'common',
    PRIMARY KEY (id)
);

-- ============================================================
-- TABLE 2: attacks
-- Real move names and base power from pokemondb.net
-- category removed
-- ============================================================

CREATE TABLE IF NOT EXISTS attacks (
    id      INT NOT NULL AUTO_INCREMENT,
    name    VARCHAR(50) NOT NULL,
    type    VARCHAR(15) NOT NULL,
    power   INT NOT NULL,
    PRIMARY KEY (id)
);

-- ============================================================
-- TABLE 3: pokemon_attacks
-- Junction table linking pokemon to their moves.
-- Each pokemon gets 2-4 moves.
-- ============================================================

CREATE TABLE IF NOT EXISTS pokemon_attacks (
    pokemon_id  INT NOT NULL,
    attack_id   INT NOT NULL,
    PRIMARY KEY (pokemon_id, attack_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
    FOREIGN KEY (attack_id) REFERENCES attacks(id)
);

-- ============================================================
-- TABLE 4: players
-- Stores player info and game state.
-- coord_x, coord_y, current_map defaults set by Leo.
-- currency added for gambling system, default 50 so new players
-- can pull from the gacha at least once.
-- ============================================================

CREATE TABLE IF NOT EXISTS players (
    id          INT NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL,
    current_map INT NOT NULL DEFAULT 1,
    coord_x     FLOAT NOT NULL DEFAULT 335,
    coord_y     FLOAT NOT NULL DEFAULT 100,
    currency    INT NOT NULL DEFAULT 50,
    wins        INT NOT NULL DEFAULT 0,
    losses      INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

-- ============================================================
-- TABLE 5: player_pokemon
-- Tracks which pokemon a player has and their current HP.
-- current_hp is separate from base hp since it changes in battle.
-- Makiya uses this for training/stat increases.
-- ============================================================

CREATE TABLE IF NOT EXISTS player_pokemon (
    player_id   INT NOT NULL,
    pokemon_id  INT NOT NULL,
    current_hp  INT NOT NULL,
    attack      INT NOT NULL,
    defense     INT NOT NULL,
    speed       INT NOT NULL,
    PRIMARY KEY (player_id, pokemon_id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id)
);

-- ============================================================
-- SEED DATA: 36 randomly selected Gen 1 Pokemon
-- max_hp and hp start as the same value
-- rarity: legendary = Articuno, Zapdos, Dragonite (very low pull odds)
--         rare = strong/high stat-total pokemon (mid odds)
--         common = everything else (default, most common pulls)
-- ============================================================

INSERT INTO pokemon (id, name, type1, type2, max_hp, hp, attack, defense, speed, image_path, rarity) VALUES
(  9, 'Blastoise',  'Water',    NULL,       79,  79,  83, 100,  78, 'imgs/proj3_images/1st Generation/009Blastoise.png',  'rare'),
( 14, 'Kakuna',     'Bug',      'Poison',   45,  45,  25,  50,  35, 'imgs/proj3_images/1st Generation/014Kakuna.png',     'common'),
( 15, 'Beedrill',   'Bug',      'Poison',   65,  65,  90,  40,  75, 'imgs/proj3_images/1st Generation/015Beedrill.png',   'common'),
( 24, 'Arbok',      'Poison',   NULL,       60,  60,  85,  69,  80, 'imgs/proj3_images/1st Generation/024Arbok.png',      'common'),
( 27, 'Sandshrew',  'Ground',   NULL,       50,  50,  75,  85,  40, 'imgs/proj3_images/1st Generation/027Sandshrew.png',  'common'),
( 39, 'Jigglypuff', 'Normal',   'Fairy',   115, 115,  45,  20,  20, 'imgs/proj3_images/1st Generation/039Jigglypuff.png', 'common'),
( 45, 'Vileplume',  'Grass',    'Poison',   75,  75,  80,  85,  50, 'imgs/proj3_images/1st Generation/045Vileplume.png',  'common'),
( 48, 'Venonat',    'Bug',      'Poison',   60,  60,  55,  50,  45, 'imgs/proj3_images/1st Generation/048Venonat.png',    'common'),
( 50, 'Diglett',    'Ground',   NULL,       10,  10,  55,  25,  95, 'imgs/proj3_images/1st Generation/050Diglett.png',    'common'),
( 56, 'Mankey',     'Fighting', NULL,       40,  40,  80,  35,  70, 'imgs/proj3_images/1st Generation/056Mankey.png',     'common'),
( 59, 'Arcanine',   'Fire',     NULL,       90,  90, 110,  80,  95, 'imgs/proj3_images/1st Generation/059Arcanine.png',   'rare'),
( 60, 'Poliwag',    'Water',    NULL,       40,  40,  50,  40,  90, 'imgs/proj3_images/1st Generation/060Poliwag.png',    'common'),
( 63, 'Abra',       'Psychic',  NULL,       25,  25,  20,  15,  90, 'imgs/proj3_images/1st Generation/063Abra.png',       'common'),
( 64, 'Kadabra',    'Psychic',  NULL,       40,  40,  35,  30, 105, 'imgs/proj3_images/1st Generation/064Kadabra.png',    'common'),
( 65, 'Alakazam',   'Psychic',  NULL,       55,  55,  50,  45, 120, 'imgs/proj3_images/1st Generation/065Alakazam.png',   'rare'),
( 68, 'Machamp',    'Fighting', NULL,       90,  90, 130,  80,  55, 'imgs/proj3_images/1st Generation/068Machamp.png',    'rare'),
( 69, 'Bellsprout', 'Grass',    'Poison',   50,  50,  75,  35,  40, 'imgs/proj3_images/1st Generation/069Bellsprout.png', 'common'),
( 72, 'Tentacool',  'Water',    'Poison',   40,  40,  40,  35,  70, 'imgs/proj3_images/1st Generation/072Tentacool.png',  'common'),
( 77, 'Ponyta',     'Fire',     NULL,       50,  50,  85,  55,  90, 'imgs/proj3_images/1st Generation/077Ponyta.png',     'common'),
( 90, 'Shellder',   'Water',    NULL,       30,  30,  65, 100,  40, 'imgs/proj3_images/1st Generation/090Shellder.png',   'common'),
( 92, 'Gastly',     'Ghost',    'Poison',   30,  30,  35,  30,  80, 'imgs/proj3_images/1st Generation/092Gastly.png',     'common'),
( 97, 'Hypno',      'Psychic',  NULL,       85,  85,  73,  70,  67, 'imgs/proj3_images/1st Generation/097Hypno.png',      'common'),
(101, 'Electrode',  'Electric', NULL,       60,  60,  50,  70, 140, 'imgs/proj3_images/1st Generation/101Electrode.png',  'common'),
(103, 'Exeggutor',  'Grass',    'Psychic',  95,  95,  95,  85,  55, 'imgs/proj3_images/1st Generation/103Exeggutor.png',  'rare'),
(104, 'Cubone',     'Ground',   NULL,       50,  50,  50,  95,  35, 'imgs/proj3_images/1st Generation/104Cubone.png',     'common'),
(105, 'Marowak',    'Ground',   NULL,       60,  60,  80, 110,  45, 'imgs/proj3_images/1st Generation/105Marowak.png',    'rare'),
(109, 'Koffing',    'Poison',   NULL,       40,  40,  65,  95,  35, 'imgs/proj3_images/1st Generation/109Koffing.png',    'common'),
(113, 'Chansey',    'Normal',   NULL,      250, 250,   5,   5,  50, 'imgs/proj3_images/1st Generation/113Chansey.png',    'common'),
(114, 'Tangela',    'Grass',    NULL,       65,  65,  55, 115,  60, 'imgs/proj3_images/1st Generation/114Tangela.png',    'common'),
(132, 'Ditto',      'Normal',   NULL,       48,  48,  48,  48,  48, 'imgs/proj3_images/1st Generation/132Ditto.png',      'common'),
(135, 'Jolteon',    'Electric', NULL,       65,  65,  65,  60, 130, 'imgs/proj3_images/1st Generation/135Jolteon.png',    'rare'),
(139, 'Omastar',    'Rock',     'Water',    70,  70,  60, 125,  55, 'imgs/proj3_images/1st Generation/139Omastar.png',    'rare'),
(141, 'Kabutops',   'Rock',     'Water',    60,  60, 115, 105,  80, 'imgs/proj3_images/1st Generation/141Kabutops.png',   'rare'),
(144, 'Articuno',   'Ice',      'Flying',   90,  90,  85, 100,  85, 'imgs/proj3_images/1st Generation/144Articuno.png',   'legendary'),
(145, 'Zapdos',     'Electric', 'Flying',   90,  90,  90,  85, 100, 'imgs/proj3_images/1st Generation/145Zapdos.png',     'legendary'),
(149, 'Dragonite',  'Dragon',   'Flying',   91,  91, 134,  95,  80, 'imgs/proj3_images/1st Generation/149Dragonite.png',  'legendary');

-- ============================================================
-- SEED DATA: attacks
-- Real move names and base power from pokemondb.net
-- Covers all types in 36 pokemon
-- ============================================================

INSERT INTO attacks (name, type, power) VALUES
-- Water (5 moves)
('Water Gun',       'Water',    40),
('Aqua Jet',        'Water',    40),
('Aqua Tail',       'Water',    90),
('Hydro Pump',      'Water',   110),
('Surf',            'Water',    90),
-- Fire (5 moves)
('Ember',           'Fire',     40),
('Fire Fang',       'Fire',     65),
('Flamethrower',    'Fire',     90),
('Fire Blast',      'Fire',    110),
('Heat Wave',       'Fire',     95),
-- Grass (4 moves)
('Absorb',          'Grass',    20),
('Razor Leaf',      'Grass',    55),
('Solar Beam',      'Grass',   120),
('Energy Ball',     'Grass',    90),
-- Poison (4 moves)
('Poison Sting',    'Poison',   15),
('Sludge',          'Poison',   65),
('Sludge Bomb',     'Poison',   90),
('Gunk Shot',       'Poison',  120),
-- Bug (3 moves)
('Leech Life',      'Bug',      80),
('Bug Bite',        'Bug',      60),
('Bug Buzz',        'Bug',      90),
-- Ground (4 moves)
('Mud Slap',        'Ground',   20),
('Bulldoze',        'Ground',   60),
('Dig',             'Ground',   80),
('Earthquake',      'Ground',  100),
-- Normal (5 moves)
('Tackle',          'Normal',   40),
('Scratch',         'Normal',   40),
('Body Slam',       'Normal',   85),
('Hyper Beam',      'Normal',  150),
('Swift',           'Normal',   60),
-- Fighting (4 moves)
('Karate Chop',     'Fighting', 50),
('Low Kick',        'Fighting', 50),
('Cross Chop',      'Fighting',100),
('Close Combat',    'Fighting',120),
-- Psychic (4 moves)
('Confusion',       'Psychic',  50),
('Psybeam',         'Psychic',  65),
('Psychic',         'Psychic',  90),
('Psyshock',        'Psychic',  80),
-- Electric (4 moves)
('Thunder Shock',   'Electric', 40),
('Spark',           'Electric', 65),
('Thunderbolt',     'Electric', 90),
('Thunder',         'Electric',110),
-- Rock (4 moves)
('Rock Throw',      'Rock',     50),
('Rock Slide',      'Rock',     75),
('Stone Edge',      'Rock',    100),
('Rock Blast',      'Rock',     25),
-- Flying (4 moves)
('Gust',            'Flying',   40),
('Aerial Ace',      'Flying',   60),
('Air Slash',       'Flying',   75),
('Hurricane',       'Flying',  110),
-- Fairy (3 moves)
('Disarming Voice', 'Fairy',    40),
('Moonblast',       'Fairy',    95),
('Dazzling Gleam',  'Fairy',    80),
-- Ghost (2 moves)
('Lick',            'Ghost',    30),
('Shadow Ball',     'Ghost',    80),
-- Ice (2 moves)
('Ice Shard',       'Ice',      40),
('Blizzard',        'Ice',     110),
-- Dragon (2 moves)
('Dragon Rage',     'Dragon',   40),
('Dragon Claw',     'Dragon',   80);

-- ============================================================
-- SEED DATA: pokemon_attacks
-- Each pokemon gets 2-4 moves matching their type(s)
-- attack ids:
--   Water:    1=Water Gun, 2=Aqua Jet, 3=Aqua Tail, 4=Hydro Pump, 5=Surf
--   Fire:     6=Ember, 7=Fire Fang, 8=Flamethrower, 9=Fire Blast, 10=Heat Wave
--   Grass:    11=Absorb, 12=Razor Leaf, 13=Solar Beam, 14=Energy Ball
--   Poison:   15=Poison Sting, 16=Sludge, 17=Sludge Bomb, 18=Gunk Shot
--   Bug:      19=Leech Life, 20=Bug Bite, 21=Bug Buzz
--   Ground:   22=Mud Slap, 23=Bulldoze, 24=Dig, 25=Earthquake
--   Normal:   26=Tackle, 27=Scratch, 28=Body Slam, 29=Hyper Beam, 30=Swift
--   Fighting: 31=Karate Chop, 32=Low Kick, 33=Cross Chop, 34=Close Combat
--   Psychic:  35=Confusion, 36=Psybeam, 37=Psychic, 38=Psyshock
--   Electric: 39=Thunder Shock, 40=Spark, 41=Thunderbolt, 42=Thunder
--   Rock:     43=Rock Throw, 44=Rock Slide, 45=Stone Edge, 46=Rock Blast
--   Flying:   47=Gust, 48=Aerial Ace, 49=Air Slash, 50=Hurricane
--   Fairy:    51=Disarming Voice, 52=Moonblast, 53=Dazzling Gleam
--   Ghost:    54=Lick, 55=Shadow Ball
--   Ice:      56=Ice Shard, 57=Blizzard
--   Dragon:   58=Dragon Rage, 59=Dragon Claw
-- ============================================================

INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
-- Blastoise (Water)
(9,   1), (9,   3), (9,   4), (9,   5),
-- Kakuna (Bug/Poison)
(14,  20), (14, 15),
-- Beedrill (Bug/Poison)
(15,  20), (15, 21), (15, 17),
-- Arbok (Poison)
(24,  16), (24, 17),
-- Sandshrew (Ground)
(27,  23), (27, 24),
-- Jigglypuff (Normal/Fairy)
(39,  28), (39, 51), (39, 52),
-- Vileplume (Grass/Poison)
(45,  12), (45, 13), (45, 17),
-- Venonat (Bug/Poison)
(48,  20), (48, 16),
-- Diglett (Ground)
(50,  22), (50, 24),
-- Mankey (Fighting)
(56,  31), (56, 32),
-- Arcanine (Fire)
(59,  8),  (59,  9), (59, 10),
-- Poliwag (Water)
(60,  1),  (60,  2),
-- Abra (Psychic)
(63,  35), (63, 37),
-- Kadabra (Psychic)
(64,  36), (64, 37),
-- Alakazam (Psychic)
(65,  37), (65, 38), (65, 29), (65, 30),
-- Machamp (Fighting)
(68,  33), (68, 34),
-- Bellsprout (Grass/Poison)
(69,  11), (69, 16),
-- Tentacool (Water/Poison)
(72,  1),  (72, 15),
-- Ponyta (Fire)
(77,  6),  (77,  8),
-- Shellder (Water)
(90,  1),  (90,  3),
-- Gastly (Ghost/Poison)
(92,  54), (92, 55),
-- Hypno (Psychic)
(97,  36), (97, 37),
-- Electrode (Electric)
(101, 39), (101, 41),
-- Exeggutor (Grass/Psychic)
(103, 13), (103, 37),
-- Cubone (Ground)
(104, 22), (104, 24),
-- Marowak (Ground)
(105, 24), (105, 25),
-- Koffing (Poison)
(109, 16), (109, 17),
-- Chansey (Normal)
(113, 26), (113, 28),
-- Tangela (Grass)
(114, 12), (114, 14),
-- Ditto (Normal)
(132, 26), (132, 30),
-- Jolteon (Electric)
(135, 41), (135, 42),
-- Omastar (Rock/Water)
(139, 43), (139,  5),
-- Kabutops (Rock/Water)
(141, 44), (141,  3),
-- Articuno (Ice/Flying)
(144, 56), (144, 57), (144, 50),
-- Zapdos (Electric/Flying)
(145, 41), (145, 42), (145, 50),
-- Dragonite (Dragon/Flying)
(149, 58), (149, 59), (149, 50), (149, 29);


-- ============================================================
-- SEED DATA: trainer
-- Each trainer gets between 1-6 pokemon
-- There are 4 trainers for each trainer encounter to choose from
-- ============================================================
INSERT INTO players (id, name) VALUES
(1, 'Joe'), 
(2, 'May'), 
(3, 'Gary'), 
(4, 'Barry'), 
(5, 'Ash'), 
(6, 'Red');

INSERT INTO player_pokemon (pokemon_id, player_id, current_hp, attack, defense, speed) 
VALUES
-- Trainer 1 (grass)
(69, 1, 50, 75, 35, 40), 
(114, 1, 65, 55, 115, 60), 
(103, 1, 95, 95, 85, 55),
(45, 1, 75, 80, 85, 50), 
-- Trainer 2, (easy)
(27, 2, 50, 75, 85, 40), 
-- Trainer 3, (easy)
(50, 3, 10, 55, 25, 95), 
-- Trainer 4, (easy)
(39, 4, 115, 45, 20, 20), 
-- Trainer 5, (medium)
(63, 5, 25, 20, 15, 90),  
(97, 5, 85, 73, 70, 67),  
(104, 5, 50, 50, 95, 35),  
(135, 5, 65, 65, 60, 130), 
-- Trainer 6, (hard)
(24, 6, 60, 85, 69, 80),  
(14, 6, 45, 25, 50, 35),  
(144, 6, 90, 85, 100, 85), 
(9, 6, 79, 83, 100, 78),    
(65, 6, 55, 50, 45, 120), 
(135, 6, 65, 65, 60, 130);  


