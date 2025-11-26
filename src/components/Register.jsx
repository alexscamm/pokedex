import React, { useState } from 'react';
import { registerUser } from '../services/api';

export default function Register({ onRegistered, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(username, password);
      if (res && res.success) {
        if (onRegistered) onRegistered();
      } else {
        setError(res && res.message ? res.message : 'Error al registrar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Usuario</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Confirmar contraseña</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
          <button type="button" className="btn" onClick={() => onCancel && onCancel()}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
