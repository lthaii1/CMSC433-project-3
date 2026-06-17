CREATE DATABASE pokemon_db

USE pokemon_db;

CREATE TABLE pokedex (
    id  INT NOT NULL AUTO_INCREMENT,
    name    VARCHAR(15) NOT NULL,
    hp  INT NOT NULL,
    weakness    VARCHAR(15) NOT NULL,
    type    VARCHAR(15) NOT NULL,
    atk1    VARCHAR(15) NOT NULL,
    atk2    VARCHAR(15) NOT NULL,
    height  FLOAT NOT NULL,
    PRIMARY KEY(id)
);
