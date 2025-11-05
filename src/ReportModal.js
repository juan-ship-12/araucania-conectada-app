// src/ReportModal.js

import React from 'react';
import Modal from 'react-modal';

function ReportModal({ report, isOpen, onClose }) {
  if (!report) {
    return null; // No mostrar nada si no hay reporte seleccionado
  }

  return (
    <Modal
      isOpen={isOpen} // Le decimos si debe estar abierto o no
      onRequestClose={onClose} // Le decimos qué hacer cuando se quiere cerrar (ej: clic afuera)
      className="report-modal" // CSS para el contenido
      overlayClassName="report-modal-overlay" // CSS para el fondo oscuro
      ariaHideApp={false} // Necesario para que no dé errores de accesibilidad
    >
      <div className="modal-header">
        <h3>Reporte: {report.type || 'Sin tipo'}</h3>
        <button onClick={onClose} className="close-button">&times;</button>
      </div>

      <div className="modal-content">
        <p><strong>Descripción:</strong></p>
        <p>{report.description || 'No hay descripción.'}</p>

        {/* Aquí podríamos poner una galería de fotos en el futuro */}
        {/* <img src={report.image_url} alt="Foto del reporte" /> */}

        <p><strong>Ubicación (Lat/Lon):</strong> {report.lat}, {report.lon}</p>
      </div>
    </Modal>
  );
}

export default ReportModal;