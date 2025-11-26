import React, { useEffect, useRef, useState } from 'react'; 
import { uploadsUrl } from '../services/api';
// Componente que recibe pokemons, función onSelect y el id seleccionado

export default function PokemonCarousel({ pokemons = [], onSelect = null, selectedId = null }) {  
  // estado para saber en qué posición del carrusel estamos
  const [index, setIndex] = useState(0);
  // referencia para acceder al div del carrusel (DOM)
  const trackRef = useRef(null);

  // Efecto para cambiar automáticamente el index cada 2.8 segundos
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % pokemons.length); // gira en bucle
    }, 2800);
    return () => clearInterval(id); // limpia el intervalo cuando se desmonta el componente
  }, [pokemons.length]); // depende de la cantidad de pokemons

  // Efecto para mover el carrusel según el índice actual
  useEffect(() => {
    const track = trackRef.current; // obtiene el elemento real del carrusel
    if (!track) return; // si no existe, salir

    // calcula el ancho de cada tarjeta con margen
    const cardWidth = track.children[0] 
      ? track.children[0].getBoundingClientRect().width + 16  // si existe, mide su tamaño
      : 240; // si no, usa 240px por defecto

    // mueve el carrusel hacia la izquierda
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }, [index]); // se ejecuta cuando cambia el índice

  // Si no es arreglo, lo corregimos
  if (!Array.isArray(pokemons)) pokemons = [];
  // Si no hay pokemons, mostramos un mensaje
  if (pokemons.length === 0) return <div className="card">No hay pokémon para el carrusel.</div>;

  // ---- CONFIGURACIÓN DE ANIMACIÓN ----
  // segundos base por item (velocidad del movimiento)
  const secondsPerItem = 1.6; // mientras más pequeño = más rápido
  // duración total de animación (mínimo 6s)
  const duration = Math.max(6, pokemons.length * secondsPerItem);

  // duplicamos la lista para que haga un bucle infinito sin corte brusco
  const items = [...pokemons, ...pokemons];

  return (
    <div className="card">
      <div className="carousel-viewport">
        <div
          className="carousel-track continuous" // clase css para animación continua
          ref={trackRef} // referencia al contenedor
          style={{ animationDuration: `${duration}s` }} // duración animación
        >
          {items.map((p, idx) => { // recorremos los pokemons duplicados
            // revisa si la imagen es base64 (data:image)
            const isData = p.imagen && typeof p.imagen === 'string' && p.imagen.startsWith('data:');
            const isHttp = p.imagen && typeof p.imagen === 'string' && (p.imagen.startsWith('http://') || p.imagen.startsWith('https://') || p.imagen.startsWith('//'));
            // define origen de imagen: data URI, url absoluta o servidor backend
            const imgSrc = p.imagen ? (isData ? p.imagen : (isHttp ? p.imagen : uploadsUrl(p.imagen))) : '';

            // Render de cada tarjeta del carrusel
            return (
              <div
                key={`${p.id}-${idx}`} // clave única para cada card
                className="pokemon-card" // clase css
                style={{ minWidth: 240, marginRight: 16, cursor: onSelect ? 'pointer' : 'default' }}
                onClick={() => onSelect && onSelect(p)} // click para seleccionar
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
      </div>
    </div>
  );
}
