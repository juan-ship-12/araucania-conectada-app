// src/PanicButton.js

import React, { useState } from 'react';
import Modal from 'react-modal';

function PanicButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Números de emergencia (¡Importante! Usar los correctos para Chile)
  const numCarabineros = '133';
  const numBomberos = '132';
  const numAmbulancia = '131';

  return (
    <div>
      {/* 1. El Botón Flotante de SOS */}
      <button 
        className="panic-button" 
        onClick={() => setModalIsOpen(true)}
        title="Botón de Pánico"
      >
        SOS
      </button>

      {/* 2. El Modal que se abre */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="panic-modal"
        overlayClassName="panic-modal-overlay"
        ariaHideApp={false}
      >
        <div className="panic-modal-header">
          <h4>Contacto de Emergencia</h4>
          <button onClick={() => setModalIsOpen(false)} className="close-button">&times;</button>
        </div>

        <div className="panic-modal-body">
          <p>¿A quién necesitas contactar?</p>

          <div className="call-button-group">
            {/* Usamos 'a' (link) con 'tel:' para que abra 
              el marcador del teléfono al hacer clic.
            */}
            <a href={`tel:${numCarabineros}`} className="call-button carabineros">
              Llamar a Carabineros (133)
            </a>

            <a href={`tel:${numBomberos}`} className="call-button bomberos">
              Llamar a Bomberos (132)
            </a>

            <a href={`tel:${numAmbulancia}`} className="call-button ambulancia">
              Llamar a Ambulancia (131)
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PanicButton;