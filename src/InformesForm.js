// src/InformesForm.js

import React, { useState } from 'react';
import { supabase } from './supabaseClient'; 

function InformesForm() { // El nombre del componente
  const [description, setDescription] = useState('');
  const [type, setType] = useState('incendio'); 
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null); 

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta la geolocalización.');
      return;
    }
    setLoading(true); 
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
        alert('¡Ubicación obtenida! Ahora puedes enviar el reporte.');
      },
      (error) => {
        alert('No se pudo obtener la ubicación. Activa los permisos.');
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!location) {
      alert('Por favor, primero obtén tu ubicación.');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('reports') // <-- Tu tabla 'informes'
      .insert({
        description: description, // <-- Tu columna 'descripcion'
        type: type,             // <-- Tu columna 'tipo'
        lat: location.lat,
        lon: location.lon,
      });

    setLoading(false);

    if (error) {
      alert('Error al enviar el reporte: ' + error.message);
    } else {
      alert('¡Reporte enviado con éxito!');
      setDescription('');
      setLocation(null);
    }
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <h4>Nuevo Reporte Ciudadano</h4>
      
      <label htmlFor="type">Tipo de emergencia:</label>
      <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="incendio">Incendio</option>
        <option value="derrumba">Derrumbe</option>
        <option value="inundacion">Inundación</option>
        <option value="otro">Otro</option>
      </select>

      <label htmlFor="description">Descripción:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe brevemente lo que ves..."
        required
      />

      <button type="button" onClick={getLocation} disabled={loading}>
        {loading ? 'Obteniendo...' : (location ? '¡Ubicación Lista!' : 'Obtener mi Ubicación')}
      </button>

      <button type="submit" disabled={loading || !location}>
        {loading ? 'Enviando...' : 'Enviar Reporte'}
      </button>
    </form>
  );
}

export default InformesForm;