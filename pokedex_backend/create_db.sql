-- create_db.sql
CREATE DATABASE IF NOT EXISTS pokedex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokedex;

CREATE TABLE IF NOT EXISTS pokemons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  tipo VARCHAR(100),
  habilidad VARCHAR(255),
  descripcion TEXT,
  imagen VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
