// src/ReportModal.js (Actualizado con Geocodificación Inversa)

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

function ReportModal({ report, isOpen, onClose }) {
  const [showSensitiveImage, setShowSensitiveImage] = useState(false);
  
  // <-- 1. NUEVO ESTADO para guardar la dirección
  const [address, setAddress] = useState('Cargando dirección...');

  // Efecto para la imagen sensible (sin cambios)
  useEffect(() => {
    if (isOpen) {
      setShowSensitiveImage(false); 
    }
  }, [isOpen]);

  // <-- 2. NUEVO EFECTO para buscar la dirección real
  useEffect(() => {
    if (isOpen && report) { // Si el modal está abierto y tenemos un reporte
      setAddress('Buscando dirección...'); // Mensaje de carga
      
      // Llamada a la API de Nominatim (Geocodificación inversa)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.lat}&lon=${report.lon}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name); // ¡Guardamos la dirección real!
          } else {
            setAddress('No se pudo encontrar una dirección.');
          }
        })
        .catch(error => {
          console.error('Error en Geocodificación:', error);
          setAddress('Error al buscar dirección. (Ver Lat/Lon abajo)');
        });
    }
  }, [isOpen, report]); // Se ejecuta cada vez que el modal se abre o el reporte cambia

  if (!report) {
    return null;
  }

  // Lógica de imagen sensible (sin cambios)
  const renderImage = () => {
    if (!report.image_url) {
      return null;
    }
    if (report.is_sensitive && !showSensitiveImage) {
      return (
        <div className="image-blur-container">
          <img src={report.image_url} alt="Contenido sensible" className="image-blur" />
          <div className="blur-overlay">
            <p>⚠️ Contenido sensible</p>
            <button onClick={() => setShowSensitiveImage(true)} className="reveal-button">
              Mostrar
            </button>
          </div>
        </div>
      );
    }
    return (
      <img 
        src={report.image_url} 
        alt="Reporte" 
        style={{ width: '100%', height: 'auto', borderRadius: '4px', marginTop: '10px' }} 
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="report-modal"
      overlayClassName="report-modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h3 style={{ textTransform: 'capitalize' }}>Reporte: {report.type}</h3>
        <button onClick={onClose} className="close-button">&times;</button>
      </div>

      <div className="modal-content">
        <p><strong>Descripción:</strong></p>
        <p>{report.description || 'No hay descripción.'}</p>

        {renderImage()}

        {/* <-- 3. LÍNEA ACTUALIZADA (muestra la dirección) --> */}
        <p style={{marginTop: '15px'}}>
          <strong>Ubicación:</strong> {address}
        </p>
        {/* Mantenemos Lat/Lon como respaldo por si la API falla */}
        <p style={{fontSize: '0.8em', color: '#666'}}>
          (Lat: {report.lat}, Lon: {report.lon})
        </p>
      </div>
    </Modal>
  );
}

export default ReportModal;