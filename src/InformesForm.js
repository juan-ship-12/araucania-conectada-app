// src/InformesForm.js (Con Subida de Imágenes)

import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Modal from 'react-modal';

// Estilos (sin cambios)
const modalStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%',
    transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '400px',
    padding: '20px', borderRadius: '8px', zIndex: 3000
  },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 2999 }
};
const fabStyle = {
  position: 'absolute', bottom: '20px', right: '20px', backgroundColor: '#007bff',
  color: 'white', border: 'none', borderRadius: '50%', width: '60px',
  height: '60px', fontSize: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer', zIndex: 1001, display: 'flex', alignItems: 'center',
  justifyContent: 'center'
};

function InformesForm() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  // Estados del formulario
  const [description, setDescription] = useState('');
  const [type, setType] = useState('incendio');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  
  // <-- 1. NUEVOS ESTADOS para la imagen y el checkbox
  const [file, setFile] = useState(null);
  const [isSensitive, setIsSensitive] = useState(false);

  // Función de geolocalización (sin cambios)
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta la geolocalización.'); return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        setLoading(false);
        alert('¡Ubicación obtenida! Ahora puedes enviar el reporte.');
      },
      (error) => {
        alert('No se pudo obtener la ubicación. Activa los permisos.');
        setLoading(false);
      }
    );
  };

  // <-- 2. NUEVA FUNCIÓN para manejar la selección de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // <-- 3. FUNCIÓN handleSubmit (MODIFICADA COMPLETAMENTE)
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!location) {
      alert('Por favor, primero obtén tu ubicación.'); return;
    }

    setLoading(true);
    
    let imageUrl = null; // Variable para guardar el link de la imagen

    // --- LÓGICA DE SUBIDA DE IMAGEN ---
    if (file) {
      try {
        // 1. Crear un nombre de archivo único (para evitar sobreescribir)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`; // Ruta dentro del bucket

        // 2. Subir el archivo al bucket 'reportes'
        let { error: uploadError } = await supabase.storage
          .from('reportes') // El bucket que creamos
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // 3. Obtener el link público del archivo que acabamos de subir
        const { data: publicUrlData } = supabase.storage
          .from('reportes')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl; // ¡Aquí está el link!

      } catch (error) {
        alert('Error al subir la imagen: ' + error.message);
        setLoading(false);
        return; // Detener si la subida falla
      }
    }
    // --- FIN DE LÓGICA DE SUBIDA ---

    // 4. Insertar el reporte en la tabla (¡ahora con la URL y el checkbox!)
    const { error: insertError } = await supabase
      .from('reports')
      .insert({
        description: description,
        type: type,
        lat: location.lat,
        lon: location.lon,
        image_url: imageUrl, // <-- El link de la imagen
        is_sensitive: isSensitive // <-- El estado del checkbox
      });

    setLoading(false);

    if (insertError) {
      alert('Error al enviar el reporte: ' + insertError.message);
    } else {
      alert('¡Reporte enviado con éxito!');
      // Limpiamos todo y cerramos el modal
      setDescription('');
      setLocation(null);
      setFile(null);
      setIsSensitive(false);
      setModalIsOpen(false);
    }
  };

  // --- HTML (JSX) DEL FORMULARIO (MODIFICADO) ---
  return (
    <div>
      {/* Botón Flotante (sin cambios) */}
      <button style={fabStyle} onClick={() => setModalIsOpen(true)} title="Nuevo Reporte Ciudadano">+</button>

      {/* Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={modalStyles} ariaHideApp={false}>
        <form onSubmit={handleSubmit} className="report-form-modal">
          {/* Header (sin cambios) */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h4>Nuevo Reporte Ciudadano</h4>
            <button type="button" onClick={() => setModalIsOpen(false)} style={{background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer'}}>&times;</button>
          </div>
          
          {/* Select (sin cambios) */}
          <label htmlFor="type">Tipo de emergencia:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} style={{width: '100%', padding: '8px', margin: '10px 0'}}>
            <option value="incendio">Incendio</option>
            <option value="derrumbe">Derrumbe</option>
            <option value="inundacion">Inundación</option>
            <option value="otro">Otro</option>
          </select>

          {/* Textarea (sin cambios) */}
          <label htmlFor="description">Descripción:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brevemente lo que ves..." required
            style={{width: '100%', minHeight: '60px', padding: '8px', margin: '10px 0'}}
          />

          {/* <-- 4. NUEVOS CAMPOS (Subir Archivo y Checkbox) --> */}
          <label htmlFor="file-upload">Adjuntar Imagen (Opcional):</label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange}
            style={{width: '100%', margin: '10px 0'}}
          />
          
          <div style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
            <input id="sensitive-check" type="checkbox" checked={isSensitive} 
              onChange={(e) => setIsSensitive(e.target.checked)} 
              style={{marginRight: '10px'}}
            />
            <label htmlFor="sensitive-check">Marcar como contenido sensible</label>
          </div>
          {/* -------------------------------------------------- */}
          
          {/* Botones (sin cambios) */}
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