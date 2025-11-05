// src/AlertList.js

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Modal from 'react-modal'; // <-- 1. Importamos el Modal

// 2. Le decimos a react-modal que se "pegue" al 'root' de nuestra app
Modal.setAppElement('#root');

function AlertList() {
  // 3. Estado para guardar la alerta que se está mostrando
  const [activeAlert, setActiveAlert] = useState(null); 

  useEffect(() => {
    // 4. Nos suscribimos a la tabla 'alerts'
    const subscription = supabase
      .channel('alerts_channel') 
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' }, 
        (payload) => {
          console.log('¡Nueva alerta recibida!', payload.new);
          // 5. ¡Guardamos la nueva alerta en el estado! Esto la mostrará
          setActiveAlert(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []); 

  // 6. Función para cerrar el modal
  const closeModal = () => {
    setActiveAlert(null);
  };

  // 7. El Modal.
  // 'isOpen={activeAlert !== null}' significa: "está abierto si 'activeAlert' NO es nulo"
  return (
    <Modal
      isOpen={activeAlert !== null}
      onRequestClose={closeModal} // Permite cerrar con la tecla "Esc"
      className={`alert-modal severity-${activeAlert?.severity}`} // CSS + color de severidad
      overlayClassName="alert-modal-overlay" // CSS para el fondo oscuro
    >
      <div className="alert-modal-header">
        <span className="alert-icon">⚠️</span> {/* Tu ícono de exclamación */}
        <h3>¡{activeAlert?.title}!</h3>
        <button onClick={closeModal} className="alert-close-button">&times;</button> {/* El botón "X" */}
      </div>
      <div className="alert-modal-body">
        <p>{activeAlert?.description}</p>
      </div>
    </Modal>
  );
}

export default AlertList;