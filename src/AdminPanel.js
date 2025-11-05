// src/AdminPanel.js

import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Importamos supabase

// Contraseña secreta. ¡Cámbiala por una tuya!
const ADMIN_PASSWORD = "araucania123";

function AdminPanel() {
  // Estados para el login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados para el formulario de alerta
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('alta');
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  // Manejador del login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta');
    }
  };

  // Manejador del formulario de alertas
  const handleSubmitAlert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage('');

    const { error } = await supabase
      .from('alerts') // <-- Tu tabla 'alerts'
      .insert({
        title: title,       // <-- Tu columna 'title'
        description: description, // <-- Tu columna 'description'
        severity: severity,   // <-- Tu columna 'severity'
      });

    setLoading(false);

    if (error) {
      setFormMessage('Error al enviar alerta: ' + error.message);
    } else {
      setFormMessage('¡ALERTA ENVIADA CON ÉXITO!');
      // Limpiamos el formulario
      setTitle('');
      setDescription('');
    }
  };

  // --- VISTA DE LOGIN ---
  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <h2>Panel de Administración</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Entrar</button>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </form>
      </div>
    );
  }

  // --- VISTA DE ADMIN (SI ESTÁS LOGUEADO) ---
  return (
    <div style={styles.adminContainer}>
      <h2>Enviar Nueva Alerta</h2>
      <form onSubmit={handleSubmitAlert}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label>Severidad:</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={styles.input}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Enviando...' : '¡Enviar Alerta!'}
        </button>
        {formMessage && <p>{formMessage}</p>}
      </form>
      <button onClick={() => setIsLoggedIn(false)} style={styles.logoutButton}>
        Salir
      </button>
    </div>
  );
}

// Estilos (para no tener que crear otro CSS)
const styles = {
  loginContainer: {
    padding: '20px',
    maxWidth: '400px',
    margin: '50px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'sans-serif'
  },
  adminContainer: {
    padding: '20px',
    maxWidth: '500px',
    margin: '30px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'sans-serif'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#d9534f', // Rojo alerta
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#aaa', // Gris
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '20px'
  }
};

export default AdminPanel;