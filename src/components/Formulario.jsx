// Importa React y el hook useState
import React, { useState } from 'react';
// Importa la función para registrar un Pokémon (llama al backend)
import { registerPokemon } from '../services/api';

// Exporta el componente principal del formulario
export default function Formulario({ onAdded }) {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');  // nombre del pokemon
  const [tipo, setTipo] = useState('');  // tipo (agua, fuego...)
  const [habilidad, setHabilidad] = useState('');  // habilidad opcional
  const [descripcion, setDescripcion] = useState(''); // descripción opcional
  const [imagen, setImagen] = useState(null);  // archivo de imagen
  const [loading, setLoading] = useState(false); // estado de carga
  const [error, setError] = useState('');  // errores del formulario

  // Función para limpiar el formulario después de registrar
  const resetForm = () => {
    setNombre('');
    setTipo('');
    setHabilidad('');
    setDescripcion('');
    setImagen(null);
    setError('');
    // Limpia el input de archivo manualmente 
    const el = document.getElementById('input-imagen');
    if (el) el.value = null;
  };

  // Maneja el evento de enviar formularios
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita que se recargue la página
    setError('');

    // Validación básica (nombre y tipo son obligatorios)
    if (!nombre.trim() || !tipo.trim()) {
      setError('Los campos Nombre y Tipo son obligatorios.');
      return;
    }

    // Crea un objeto FormData para enviar archivos y texto
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('tipo', tipo);
    formData.append('habilidad', habilidad);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen); // solo si hay imagen

    try {
      setLoading(true); // activa el estado de cargando
      const res = await registerPokemon(formData); // llama al backend

      // Si el backend responde con éxito
      if (res && res.success) {
        resetForm();          // limpia el formulario
        if (onAdded) onAdded(); // recarga la lista en App.js
      } else {
        // Muestra error si el backend no responde bien
        setError(res && res.message ? res.message : 'Error al registrar');
      }
    } catch (err) {
      // Si no hay conexión con el servidor
      console.error(err);
      setError('Error en la conexión con el servidor');
    } finally {
      setLoading(false); // termina estado de carga
    }
  };

  // Render del formulario
  return (
    <div className="card">
      <h2>Registrar Pokémon</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de nombre */}
        <div className="form-field">
          <label>Nombre *</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        {/* Campo de tipo */}
        <div className="form-field">
          <label>Tipo *</label>
          <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ej. Fuego, Agua" />
        </div>

        {/* Habilidad opcional */}
        <div className="form-field">
          <label>Habilidad</label>
          <input value={habilidad} onChange={(e) => setHabilidad(e.target.value)} />
        </div>

        {/* Descripción */}
        <div className="form-field">
          <label>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} />
        </div>

        {/* Input para imagen */}
        <div className="form-field">
          <label>Imagen (.jpg o .png)</label>
          <input
            id="input-imagen"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setImagen(e.target.files[0] || null)}
          />
        </div>

        {/* Mostrar error si existe */}
        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

        {/* Botón deshabilitado mientras se guarda */}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Pokémon'}
        </button>
      </form>
    </div>
  );
}