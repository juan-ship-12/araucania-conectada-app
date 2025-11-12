// src/ReportModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

function ReportModal({ report, isOpen, onClose }) {
  const [showSensitiveImage, setShowSensitiveImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowSensitiveImage(false); 
    }
  }, [isOpen]);

  if (!report) {
    return null;
  }

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

        <p style={{marginTop: '15px'}}>
          <strong>Ubicación (Lat/Lon):</strong> {report.lat}, {report.lon}
        </p>
      </div>
    </Modal>
  );
}

export default ReportModal;