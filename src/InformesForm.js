// src/InformesForm.js (Actualizado con "Asistente" y nuevos íconos)

import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Modal from 'react-modal';
import Swal from 'sweetalert2'; 

// Estilos del Modal (sin cambios)
const modalStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%',
    transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '400px',
    padding: '0px', borderRadius: '12px', zIndex: 3000
  },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 2999 }
};
const centralButtonStyle = {
  position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
  backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '12px',
  width: '90%', maxWidth: '400px', height: '55px', fontSize: '1.2em', fontWeight: 'bold',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)', cursor: 'pointer', zIndex: 1001,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
// --------------------------------------------------

function InformesForm() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [step, setStep] = useState('location'); 
  const [description, setDescription] = useState('');
  const [type, setType] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Obteniendo ubicación...'); 
  const [file, setFile] = useState(null);
  const [isSensitive, setIsSensitive] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
    setStep('location'); 
    setLoading(true);
    setAddress('Obteniendo ubicación...');
    
    if (!navigator.geolocation) {
      Swal.fire('Error', 'Tu navegador no soporta la geolocalización.', 'warning');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
        setLocation(newLocation);
        fetchAddress(newLocation);
      },
      (error) => {
        Swal.fire('Error', 'No se pudo obtener la ubicación. Activa los permisos.', 'error');
        setLoading(false);
        setAddress('Error al obtener ubicación.');
      }
    );
  };
  
  const fetchAddress = async (loc) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lon}`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name); 
      } else {
        setAddress('Dirección no encontrada.');
      }
    } catch (error) {
      setAddress('Error al buscar dirección.');
    }
    setLoading(false); 
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!type) { 
      Swal.fire('Atención', 'Por favor, selecciona un tipo de emergencia.', 'warning');
      return;
    }

    setLoading(true);
    let imageUrl = null; 
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`; 
        let { error: uploadError } = await supabase.storage
          .from('reportes') 
          .upload(filePath, file);
        if (uploadError) { throw uploadError; }
        const { data: publicUrlData } = supabase.storage
          .from('reportes')
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      } catch (error) {
        Swal.fire('Error de Subida', 'Error al subir la imagen: ' + error.message, 'error');
        setLoading(false);
        return; 
      }
    }
    
    const { error: insertError } = await supabase
      .from('reports')
      .insert({
        description: description,
        type: type, // <-- 'type' se guarda con el valor correcto (ej: "derrumbe")
        lat: location.lat,
        lon: location.lon,
        image_url: imageUrl, 
        is_sensitive: isSensitive 
      });

    setLoading(false);

    if (insertError) {
      Swal.fire('Error de Reporte', 'Error al enviar el reporte: ' + insertError.message, 'error');
    } else {
      Swal.fire('¡Enviado!', '¡Reporte enviado con éxito!', 'success');
      resetAndCloseModal(); 
    }
  };
  
  const resetAndCloseModal = () => {
    setModalIsOpen(false);
    setStep('location');
    setDescription('');
    setType('');
    setLocation(null);
    setFile(null);
    setIsSensitive(false);
  };

  return (
    <div>
      <button 
        style={centralButtonStyle} 
        onClick={openModal} 
      >
        Reportar Emergencia 
      </button>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={resetAndCloseModal} 
        style={modalStyles} 
        ariaHideApp={false}
      >
        
        {/* --- PASO 1: CONFIRMAR UBICACIÓN --- */}
        {step === 'location' && (
          <div className="form-step-container location-confirm">
            <div className="step-header">
              <h4>Confirmar Ubicación</h4>
              <button onClick={resetAndCloseModal} className="close-button">&times;</button>
            </div>
            
            <p>
              {loading ? 'Obteniendo ubicación...' : (
                <>
                  Tu ubicación reportada es:<br/>
                  <strong>{address}</strong>
                </>
              )}
            </p>
            
            <div className="button-group">
              <button 
                className="confirm-button" 
                onClick={() => setStep('details')} 
                disabled={loading}
              >
                Confirmar y Continuar
              </button>
              <button className="cancel-button" onClick={resetAndCloseModal}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {/* --- PASO 2: DETALLES DEL REPORTE --- */}
        {step === 'details' && (
          <form onSubmit={handleSubmit} className="form-step-container">
            <div className="step-header">
              <h4>¿Qué está pasando?</h4>
              <button onClick={resetAndCloseModal} className="close-button">&times;</button>
            </div>

            {/* <-- ¡CUADRÍCULA DE ICONOS ACTUALIZADA! --> */}
            <div className="icon-grid">
              <button type="button" className={`icon-button ${type === 'incendio' ? 'selected' : ''}`} onClick={() => setType('incendio')}>
                <img src="/Icono_incendio.png" alt="Incendio" />
                <span>Incendio</span>
              </button>
              <button type="button" className={`icon-button ${type === 'derrumbe' ? 'selected' : ''}`} onClick={() => setType('derrumbe')}>
                <img src="/Icono_derrumbe.png" alt="Derrumbe" /> 
                <span>Derrumbe</span>
              </button>
              <button type="button" className={`icon-button ${type === 'inundacion' ? 'selected' : ''}`} onClick={() => setType('inundacion')}>
                <img src="/Icono_inundacion.png" alt="Inundación" />
                <span>Inundación</span> 
              </button>
              <button type="button" className={`icon-button ${type === 'otro' ? 'selected' : ''}`} onClick={() => setType('otro')}>
                <img src="/Icono_otro.png" alt="Otro" />
                <span>Otro</span>
              </button>
            </div>

            <label htmlFor="file-upload">Adjuntar Imagen (Opcional):</label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
            
            <div className="checkbox-container">
              <input id="sensitive-check" type="checkbox" checked={isSensitive} 
                onChange={(e) => setIsSensitive(e.target.checked)} 
              />
              <label htmlFor="sensitive-check" style={{fontWeight: 'normal', marginTop: '0'}}>Marcar como contenido sensible</label>
            </div>
            
            <label htmlFor="description">Explícanos más (Opcional):</label>
            <textarea id="description" value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Fuego en 2do piso, hay 1 persona atrapada..."
            />
            
            <div className="button-group">
              <button type="submit" className="confirm-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Reporte'}
              </button>
            </div>
          </form>
        )}
        
      </Modal>
    </div>
  );
}

export default InformesForm;