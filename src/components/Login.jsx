import React, { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLogin, onRegisterRequested }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(username, password);
      if (res && res.success) {
        if (onLogin) onLogin({ username: res.username, id: res.id });
      } else {
        setError(res && res.message ? res.message : 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Usuario</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </div>

        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          <button type="button" className="btn" onClick={() => onRegisterRequested && onRegisterRequested()}>Registrarse</button>
        </div>
      </form>
    </div>
  );
}
