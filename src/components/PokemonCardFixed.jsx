import React, { useState, useEffect } from 'react';

export default function PokemonCard({ pokemon = null, onSave = null }) {
  // Estado para nombre, colores e información
  const [nombre, setNombre] = useState('Pikachu');
  const [tipo, setTipo] = useState('Eléctrico');
  const [habilidad, setHabilidad] = useState('Electricidad Estática');
  const [descripcion, setDescripcion] = useState('Un Pokémon estático de ejemplo.');
  const [colorFondo, setColorFondo] = useState('#fff8e1');
  const [colorTexto, setColorTexto] = useState('#ffb300');
  const [colorBorde, setColorBorde] = useState('#ffb300');
  const [imagenUrl, setImagenUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (pokemon) {
      setNombre(pokemon.nombre || 'Pikachu');
      setTipo(pokemon.tipo || 'Eléctrico');
      setHabilidad(pokemon.habilidad || 'Electricidad Estática');
      setDescripcion(pokemon.descripcion || 'Un Pokémon estático de ejemplo.');
      setColorFondo(pokemon.colorFondo || '#fff8e1');
      setColorTexto(pokemon.colorTexto || '#ffb300');
      setColorBorde(pokemon.colorBorde || '#ffb300');
      setImagenUrl(pokemon.imagen || null);
    } else {
      const saved = localStorage.getItem('pokemonCardData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setNombre(data.nombre || 'Pikachu');
          setTipo(data.tipo || 'Eléctrico');
          setHabilidad(data.habilidad || 'Electricidad Estática');
          setDescripcion(data.descripcion || 'Un Pokémon estático de ejemplo.');
          setColorFondo(data.colorFondo || '#fff8e1');
          setColorTexto(data.colorTexto || '#ffb300');
          setColorBorde(data.colorBorde || '#ffb300');
          setImagenUrl(data.imagenUrl || null);
        } catch (e) {
          console.error('Error al cargar datos guardados', e);
        }
      }
    }
  }, [pokemon]);

  const saveData = (updates = {}) => {
    const data = {
      nombre: updates.nombre !== undefined ? updates.nombre : nombre,
      tipo: updates.tipo !== undefined ? updates.tipo : tipo,
      habilidad: updates.habilidad !== undefined ? updates.habilidad : habilidad,
      descripcion: updates.descripcion !== undefined ? updates.descripcion : descripcion,
      colorFondo: updates.colorFondo !== undefined ? updates.colorFondo : colorFondo,
      colorTexto: updates.colorTexto !== undefined ? updates.colorTexto : colorTexto,
      colorBorde: updates.colorBorde !== undefined ? updates.colorBorde : colorBorde,
      imagenUrl: updates.imagenUrl !== undefined ? updates.imagenUrl : imagenUrl,
    };
    localStorage.setItem('pokemonCardData', JSON.stringify(data));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrl(reader.result);
        if (!pokemon) saveData({ imagenUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNombreChange = (val) => {
    setNombre(val);
    if (!pokemon) saveData({ nombre: val });
  };

  const handleTipoChange = (val) => {
    setTipo(val);
    if (!pokemon) saveData({ tipo: val });
  };

  const handleHabilidadChange = (val) => {
    setHabilidad(val);
    if (!pokemon) saveData({ habilidad: val });
  };

  const handleDescripcionChange = (val) => {
    setDescripcion(val);
    if (!pokemon) saveData({ descripcion: val });
  };

  const handleColorFondoChange = (val) => {
    setColorFondo(val);
    if (!pokemon) saveData({ colorFondo: val });
  };

  const handleColorTextoChange = (val) => {
    setColorTexto(val);
    if (!pokemon) saveData({ colorTexto: val });
  };

  const handleColorBordeChange = (val) => {
    setColorBorde(val);
    if (!pokemon) saveData({ colorBorde: val });
  };

  const resetToDefault = () => {
    setNombre('Pikachu');
    setTipo('Eléctrico');
    setHabilidad('Electricidad Estática');
    setDescripcion('Un Pokémon estático de ejemplo.');
    setColorFondo('#fff8e1');
    setColorTexto('#ffb300');
    setColorBorde('#ffb300');
    setImagenUrl(null);
    if (!pokemon) localStorage.removeItem('pokemonCardData');
  };

  const handleRemoveImage = () => {
    setImagenUrl(null);
    if (!pokemon) {
      saveData({ imagenUrl: null });
      const inp = document.getElementById('pokemon-image-input');
      if (inp) inp.value = '';
    }
  };

  const handleSave = () => {
    if (!pokemon) {
      saveData();
      setIsEditing(false);
      return;
    }

    const updated = {
      ...pokemon,
      nombre,
      tipo,
      habilidad,
      descripcion,
      imagen: imagenUrl || pokemon.imagen,
    };

    if (onSave) onSave(updated);
    setIsEditing(false);
  };

  const getImageSrc = () => {
    if (!imagenUrl) return null;
    if (typeof imagenUrl === 'string' && imagenUrl.startsWith('data:')) return imagenUrl;
    if (typeof imagenUrl === 'string') {
      if (imagenUrl.startsWith('http')) return imagenUrl;
      return `http://localhost/pokedex_backend/${imagenUrl}`;
    }
    return null;
  };

  return (
    <div className="pokemon-card-editor">
      <h2>{pokemon ? 'Editor (seleccionado)' : 'Editor de Pokémon'}</h2>

      <div
        className="pokemon-card-static"
        style={{
          backgroundColor: colorFondo,
          borderColor: colorBorde,
          borderWidth: '3px',
          borderStyle: 'solid',
          padding: '16px',
          borderRadius: '12px',
          maxWidth: '280px',
          margin: '20px auto',
          textAlign: 'center',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        }}
      >
        {getImageSrc() ? (
          <img
            src={getImageSrc()}
            alt={nombre}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
          />
        ) : (
          <div style={{ width: '100%', height: '200px', backgroundColor: '#e0e0e0', borderRadius: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold', color: colorTexto }}>
            ⚡
          </div>
        )}

        <h3 style={{ color: colorTexto, margin: '8px 0' }}>{nombre}</h3>

        <div style={{ color: colorTexto, fontSize: '0.9rem', marginTop: '12px' }}>
          <p><strong>Tipo:</strong> {tipo}</p>
          <p><strong>Habilidad:</strong> {habilidad}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>{descripcion}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '320px', margin: '20px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Personalización</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => setIsEditing(!isEditing)} style={{ padding: '6px 12px', fontSize: '0.9rem' }}>{isEditing ? 'Cancelar' : 'Editar'}</button>
            <button className="btn" onClick={handleSave} style={{ padding: '6px 12px', fontSize: '0.9rem', backgroundColor: '#2e7d32' }}>Guardar</button>
          </div>
        </div>

        {isEditing ? (
          <>
            <div className="form-field">
              <label>Imagen del Pokémon:</label>
              <input type="file" id="pokemon-image-input" accept="image/png, image/jpeg, image/jpg" onChange={handleImageUpload} style={{ marginBottom: 8 }} />
              {imagenUrl && (
                <>
                  <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 6, textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>✓ Imagen subida</div>
                  <button className="btn" onClick={handleRemoveImage} style={{ marginTop: 8, width: '100%', backgroundColor: '#d32f2f' }}>🗑️ Eliminar imagen</button>
                </>
              )}
            </div>

            <div className="form-field"><label>Nombre del Pokémon:</label><input type="text" value={nombre} onChange={(e) => handleNombreChange(e.target.value)} placeholder="Ej. Pikachu" /></div>
            <div className="form-field"><label>Tipo:</label><input type="text" value={tipo} onChange={(e) => handleTipoChange(e.target.value)} placeholder="Ej. Eléctrico, Fuego, Agua" /></div>
            <div className="form-field"><label>Habilidad:</label><input type="text" value={habilidad} onChange={(e) => handleHabilidadChange(e.target.value)} placeholder="Ej. Electricidad Estática" /></div>
            <div className="form-field"><label>Descripción:</label><textarea value={descripcion} onChange={(e) => handleDescripcionChange(e.target.value)} placeholder="Describe al Pokémon..." rows={3} /></div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #ddd' }}>
              <h4>Colores</h4>
              <div className="form-field"><label>Color de Fondo (Hex):</label><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="color" value={colorFondo} onChange={(e) => handleColorFondoChange(e.target.value)} /><input type="text" value={colorFondo} onChange={(e) => handleColorFondoChange(e.target.value)} placeholder="#fff8e1" style={{ flex: 1 }} /></div></div>
              <div className="form-field"><label>Color de Texto (Hex):</label><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="color" value={colorTexto} onChange={(e) => handleColorTextoChange(e.target.value)} /><input type="text" value={colorTexto} onChange={(e) => handleColorTextoChange(e.target.value)} placeholder="#ffb300" style={{ flex: 1 }} /></div></div>
              <div className="form-field"><label>Color de Borde (Hex):</label><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="color" value={colorBorde} onChange={(e) => handleColorBordeChange(e.target.value)} /><input type="text" value={colorBorde} onChange={(e) => handleColorBordeChange(e.target.value)} placeholder="#ffb300" style={{ flex: 1 }} /></div></div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn" onClick={resetToDefault} style={{ flex: 1 }}>Resetear</button>
            </div>
          </>
        ) : (
          <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>Haz clic en "Editar" para modificar el Pokémon.</div>
        )}
      </div>
    </div>
  );
}
