// src/InformesForm.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Modal from 'react-modal'; // Importamos el Modal

// Estilos para el Modal (para que se vea bien centrado)
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 3000 // Asegurarse de que esté sobre todo
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 2999
  }
};

// Estilos para el botón flotante
const fabStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '50%', // Redondo
  width: '60px',
  height: '60px',
  fontSize: '24px', // Tamaño del "+"
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  zIndex: 1001, // Sobre el mapa, pero bajo el modal
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};


function InformesForm() {
  // Estado para saber si el modal (formulario) está abierto
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Estados para el formulario (lo mismo de antes)
  const [description, setDescription] = useState('');
  const [type, setType] = useState('incendio');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  // --- FUNCIONES DEL FORMULARIO (sin cambios) ---
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
      .from('reports')
      .insert({
        description: description,
        type: type,
        lat: location.lat,
        lon: location.lon,
      });

    setLoading(false);

    if (error) {
      alert('Error al enviar el reporte: ' + error.message);
    } else {
      alert('¡Reporte enviado con éxito!');
      // Limpiamos y CERRAMOS el modal
      setDescription('');
      setLocation(null);
      setModalIsOpen(false); // <--- ¡NUEVO!
    }
  };

  // --- LO QUE SE DIBUJA (ahora es un botón Y un modal) ---
  return (
    <div>
      {/* 1. El Botón Flotante */}
      <button 
        style={fabStyle} 
        onClick={() => setModalIsOpen(true)}
        title="Nuevo Reporte Ciudadano"
      >
        +
      </button>

      {/* 2. El Modal (que contiene el formulario) */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
        contentLabel="Formulario de Reporte"
        ariaHideApp={false}
      >
        {/* Este es tu formulario de antes, pero dentro del Modal */}
        <form onSubmit={handleSubmit} className="report-form-modal">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h4>Nuevo Reporte Ciudadano</h4>
            <button 
              type="button" 
              onClick={() => setModalIsOpen(false)} 
              style={{background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer'}}
            >
              &times;
            </button>
          </div>

          <label htmlFor="type">Tipo de emergencia:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} style={{width: '100%', padding: '8px', margin: '10px 0'}}>
            <option value="incendio">Incendio</option>
            <option value="derrumbe">Derrumbe</option>
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
            style={{width: '100%', minHeight: '60px', padding: '8px', margin: '10px 0'}}
          />

          <button type="button" onClick={getLocation} disabled={loading} style={{width: '100%', padding: '10px', margin: '5px 0'}}>
            {loading ? 'Obteniendo...' : (location ? '¡Ubicación Lista!' : 'Obtener mi Ubicación')}
          </button>

          <button type="submit" disabled={loading || !location} style={{width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#007bff', color: 'white'}}>
            {loading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default InformesForm;