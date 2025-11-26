import React, { useState, useEffect } from 'react';  // Importamos React y los hooks necesarios
import { uploadsUrl } from '../services/api';

export default function PokemonCard({ pokemon = null, onSave = null }) {  // Componente principal que recibe props
  const [nombre, setNombre] = useState('Pikachu');  // Estado para el nombre del Pokémon
  const [tipo, setTipo] = useState('Eléctrico');  // Estado para el tipo
  const [habilidad, setHabilidad] = useState('Electricidad Estática');  // Estado para la habilidad
  const [descripcion, setDescripcion] = useState('Un Pokémon de ejemplo.'); // Estado para la descripción
  const [colorFondo, setColorFondo] = useState('#fff8e1');  // Estado para el color de fondo
  const [colorTexto, setColorTexto] = useState('#ffb300');  // Estado para color del texto
  const [colorBorde, setColorBorde] = useState('#ffb300');  // Estado para color del borde
  const [imagenUrl, setImagenUrl] = useState(null);  // Estado para la imagen
  const [isEditing, setIsEditing] = useState(false);  // Estado para activar/desactivar modo edición

  useEffect(() => {  // Se ejecuta cuando cambia el prop 'pokemon'
    if (pokemon) {  // Si viene un Pokémon desde props, cargamos sus datos
      setNombre(pokemon.nombre || 'Pikachu');
      setTipo(pokemon.tipo || 'Eléctrico');
      setHabilidad(pokemon.habilidad || 'Electricidad Estática');
      setDescripcion(pokemon.descripcion || 'Un Pokémon de ejemplo.');
      setColorFondo(pokemon.colorFondo || '#fff8e1');
      setColorTexto(pokemon.colorTexto || '#ffb300');
      setColorBorde(pokemon.colorBorde || '#ffb300');
      setImagenUrl(pokemon.imagen || null);
      setIsEditing(false);  // Cerramos modo edición
    } else {  // Si no viene Pokémon, cargamos desde localStorage
      const saved = localStorage.getItem('pokemonCardData');
      if (saved) {  // Si hay algo guardado
        try {
          const data = JSON.parse(saved);  // Convertimos a objeto
          setNombre(data.nombre || 'Pikachu');
          setTipo(data.tipo || 'Eléctrico');
          setHabilidad(data.habilidad || 'Electricidad Estática');
          setDescripcion(data.descripcion || 'Un Pokémon de ejemplo.');
          setColorFondo(data.colorFondo || '#fff8e1');
          setColorTexto(data.colorTexto || '#ffb300');
          setColorBorde(data.colorBorde || '#ffb300');
          setImagenUrl(data.imagenUrl || null);
        } catch (e) {
          console.warn('No se pudieron cargar datos guardados', e);  // Si falla el JSON
        }
      }
    }
  }, [pokemon]);  // El useEffect depende de 'pokemon'

  const saveLocal = (updates = {}) => {  // Función para guardar datos en localStorage
    const data = {  // Se arma objeto con valores NUEVOS o actuales
      nombre: updates.nombre !== undefined ? updates.nombre : nombre,
      tipo: updates.tipo !== undefined ? updates.tipo : tipo,
      habilidad: updates.habilidad !== undefined ? updates.habilidad : habilidad,
      descripcion: updates.descripcion !== undefined ? updates.descripcion : descripcion,
      colorFondo: updates.colorFondo !== undefined ? updates.colorFondo : colorFondo,
      colorTexto: updates.colorTexto !== undefined ? updates.colorTexto : colorTexto,
      colorBorde: updates.colorBorde !== undefined ? updates.colorBorde : colorBorde,
      imagenUrl: updates.imagenUrl !== undefined ? updates.imagenUrl : imagenUrl,
    };
    try {
      localStorage.setItem('pokemonCardData', JSON.stringify(data));  // Guardamos en localStorage
    } catch (e) {
      // ignore
    }
  };

  const handleImageUpload = (e) => {  // Función para subir imagen
    const file = e.target.files && e.target.files[0];  // Tomamos archivo
    if (!file) return;  // Si no hay archivo, salimos
    const reader = new FileReader();  // Lector de archivos
    reader.onloadend = () => {  // Cuando se carga…
      setImagenUrl(reader.result);  // Guardamos imagen en estado
      if (!pokemon) saveLocal({ imagenUrl: reader.result });  // Guardamos local si no es de BD
    };
    reader.readAsDataURL(file);  // Leemos la imagen como base64
  };

  const handleSave = () => {  // Función guardar cambios
    if (!pokemon) {  // Si es local…
      saveLocal();  // Guardamos en localStorage
      setIsEditing(false);  // Salimos de edición
      return;
    }

    const updated = {  // Creamos objeto actualizado con datos del form
      ...pokemon,
      nombre,
      tipo,
      habilidad,
      descripcion,
      imagen: imagenUrl || pokemon.imagen,
      colorFondo,
      colorTexto,
      colorBorde,
    };

    if (onSave) onSave(updated);  // Mandamos a guardar en BD si existe la función
    setIsEditing(false);  // Cerramos edición
  };

  const handleRemoveImage = () => {  // Función para eliminar imagen
    setImagenUrl(null);
    if (!pokemon) saveLocal({ imagenUrl: null });
    const inp = document.getElementById('pokemon-image-input');  // Limpiamos input file
    if (inp) inp.value = '';
  };

  const getImageSrc = () => {  // Función que devuelve la URL de imagen correcta
    if (!imagenUrl) return null;
    if (typeof imagenUrl === 'string' && imagenUrl.startsWith('data:')) return imagenUrl;
      if (typeof imagenUrl === 'string') {
      if (imagenUrl.startsWith('http')) return imagenUrl;
      return uploadsUrl(imagenUrl);
    }
    return null;
  };

  return (  // JSX que se renderiza en pantalla
    <div className="pokemon-card-editor">
      <h2 style={{ textAlign: 'center' }}>{pokemon ? 'Editar Pokémon seleccionado' : 'Editor de Pokémon (local)'}</h2>

      <div
        className="pokemon-card-static"
        style={{
          backgroundColor: colorFondo,
          borderColor: colorBorde,
          borderWidth: '3px',
          borderStyle: 'solid',
          padding: '16px',
          borderRadius: '12px',
          maxWidth: '320px',
          margin: '12px auto',
          textAlign: 'center',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
        }}
      >
        {getImageSrc() ? (
          <img src={getImageSrc()} alt={nombre} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
        ) : (
          <div style={{ width: '100%', height: 200, backgroundColor: '#e9e9e9', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: colorTexto }}>
            ⚡
          </div>
        )}

        <h3 style={{ color: colorTexto, margin: '6px 0' }}>{nombre}</h3>
        <div style={{ color: colorTexto, fontSize: 14 }}>
          <div><strong>Tipo:</strong> {tipo}</div>
          <div><strong>Habilidad:</strong> {habilidad || '—'}</div>
        </div>
        <p style={{ color: colorTexto, fontSize: 13, marginTop: 8 }}>{descripcion}</p>
      </div>

      <div style={{ maxWidth: 360, margin: '8px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>Personalización</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => setIsEditing((v) => !v)}>{isEditing ? 'Cancelar' : 'Editar'}</button>
            <button className="btn primary" onClick={handleSave}>Guardar</button>
          </div>
        </div>

        {isEditing ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <label>Imagen</label>
              <input id="pokemon-image-input" type="file" accept="image/*" onChange={handleImageUpload} />
              {imagenUrl && <div style={{ marginTop: 8 }}><button className="btn danger" onClick={handleRemoveImage}>Eliminar imagen</button></div>}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Tipo</label>
              <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Habilidad</label>
              <input type="text" value={habilidad} onChange={(e) => setHabilidad(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Color Fondo</label>
                <input type="color" value={colorFondo} onChange={(e) => setColorFondo(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Color Texto</label>
                <input type="color" value={colorTexto} onChange={(e) => setColorTexto(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Color Borde</label>
                <input type="color" value={colorBorde} onChange={(e) => setColorBorde(e.target.value)} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: 10 }}>Presiona "Editar" para modificar este Pokémon.</div>
        )}
      </div>
    </div>
  );
}
