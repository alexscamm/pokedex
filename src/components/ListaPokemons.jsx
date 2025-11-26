// Importa React para crear el componente
import React from 'react';
import { uploadsUrl } from '../services/api';
// Importa el carrusel usado cuando hay muchos Pokemones
import PokemonCarousel from './PokemonCarousel';

// Componente principal que recibe lista de pokemons y funciones opcionales
export default function ListaPokemons({ pokemons = [], onSelect = null, selectedId = null }) {
  // Valida que 'pokemons' sea un arreglo
  if (!Array.isArray(pokemons)) pokemons = [];

  return (
    <div>
      <h2>Pokémon Registrados</h2>

      {/* Mensaje cuando no hay pokemons */}
      {pokemons.length === 0 && <div className="card">No hay pokémon registrados.</div>}

      {/* Si hay más de 4 pokemons se muestra el carrusel */}
      {pokemons.length > 4 ? (
        <PokemonCarousel pokemons={pokemons} onSelect={onSelect} selectedId={selectedId} />
      ) : (
        // Si hay 4 o menos se muestran en una cuadrícula
        <div className="grid">
          {pokemons.map((p) => {
            // Revisa si la imagen es base64 (data:image/..)
            const isData = p.imagen && typeof p.imagen === 'string' && p.imagen.startsWith('data:');
            const isHttp = p.imagen && typeof p.imagen === 'string' && (p.imagen.startsWith('http://') || p.imagen.startsWith('https://') || p.imagen.startsWith('//'));
            // Define la fuente de imagen (data URI, url absoluta o ruta en uploads)
            const imgSrc = p.imagen ? (isData ? p.imagen : (isHttp ? p.imagen : uploadsUrl(p.imagen))) : ''; // imagen por defecto vacía

            // Estilos dinámicos de color
            const style = {
              cursor: onSelect ? 'pointer' : 'default',
              backgroundColor: p.colorFondo || undefined,
              borderColor: p.colorBorde || undefined,
              color: p.colorTexto || undefined,
            };

            // Resalta si el pokemon está seleccionado
            const isSelected = selectedId && p.id === selectedId;

            // Renderiza cada tarjeta de pokémon
            return (
              <div
                key={p.id} // clave única en React
                className={`pokemon-card ${isSelected ? 'selected poke-pulse' : ''}`} // clases dinámicas
                onClick={() => onSelect && onSelect(p)} // clic para seleccionar
                style={style} // aplica estilos
              >
                <img src={imgSrc} alt={p.nombre} />
                <h3>{p.nombre}</h3>
                <div className="pokemon-meta"><strong>Tipo:</strong> {p.tipo}</div>
                <div className="pokemon-meta"><strong>Habilidad:</strong> {p.habilidad}</div> 
                <p>{p.descripcion}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
